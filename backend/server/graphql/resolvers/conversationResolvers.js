// eslint-disable-next-line
const {notifyNewConversation, 
  notifyNewMessage,
  notifyChatsOfSeenMessagesSubs,
  notifyMessageDelivered,
  notifyChatNameChange,
  notifyUserRemoved,
  notifyModifiedAdmin,
  notifyTypingEvent,
  notifyDeletedMessage,
} = require("./pubsub_logic");
const conversationResolvers = {
  Query: {
    getConversationInfo: async (
      _source,
      {conversationId},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      const conversationInformation = await dataSources.conversationAPI.getConversationInfo({
        validatedUser,
        conversationId,
      });
      // To define the current conversation the user is (the one that is open)
      await dataSources.userAPI.updateCurrentConversation({validatedUser, conversationId});

      // Check if the validated user is in the conversation participants
      if (conversationInformation.participants.includes(validatedUser)) {
        notifyChatsOfSeenMessagesSubs(conversationId, validatedUser, conversationInformation.participants);

        dataSources.conversationAPI.notifyChatsOfSeenMessages({
          validatedUser,
          conversationId,
        });
      }

      // Step 3: Call the corresponding method from the conversation data source
      return conversationInformation;
    },


    getDeliveredToArray: async (
      _source,
      {conversationId, messageIndex},
      {dataSources, token},
    ) => {
      // Validate the user's operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Get the validated user
      const validatedUser = validation.validatedUser;

      return dataSources.conversationAPI.getDeliveredToArray({
        validatedUser,
        conversationId,
        messageIndex,
      });
    },

    getLastMessage: async (
      _source,
      {conversationId},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;
      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.getLastMessage({
        validatedUser,
        conversationId,
      });
    },

    getSeenByArray: async (
      _source,
      {conversationId, messageIndex},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.getSeenByArray({
        validatedUser,
        conversationId,
        messageIndex,
      });
    },
  },

  Mutation: {
    addAdminToConversation: async (
      _source,
      {conversationId, newAdmins},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Validate new admins
      await Promise.all(
        newAdmins.map((name) =>
          dataSources.authAPI.validateMessageReceiver(name),
        ),
      );

      // Step 3: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 4: Call the corresponding method from the conversation data source
      const addedAdminResponse = await dataSources.conversationAPI.addAdminToConversation({
        validatedUser,
        conversationId,
        newAdmins: newAdmins,
      });

      const {admins, participants} = addedAdminResponse;

      // The dataSources.conversationAPI.addAdminToConversation is made to prevent admin duplicates
      notifyModifiedAdmin(admins, conversationId, participants);


      return addedAdminResponse;
    },

    addChatMember: async (
      _source,
      {conversationId, namesToAdd},
      {dataSources, token},
    ) => {
      await dataSources.authAPI.validateUserOperation(token);

      // Validate each name in namesToAdd
      for (const name of namesToAdd) {
        await dataSources.authAPI.validateMessageReceiver(name);
      }

      const data = await dataSources.conversationAPI.addChatMember({
        conversationId,
        namesToAdd,
      });

      const conversation = data.conversation;
      const participants = data.conversation.participants;

      // Communicate with user service for each name
      for (const name of namesToAdd) {
        await dataSources.userAPI.addChatMember({
          conversationId,
          nameToAdd: name,
          participants,
          conversation,
        });
      }

      const conversationInfo =
      await dataSources.conversationAPI.getConversationInfo({
        validatedUser: "",
        conversationId,
      });

      // Assuming conversationId is defined
      conversationInfo.conversationId = conversationId;

      // Notify the participants of the new conversation
      notifyNewConversation(conversationInfo);

      return {
        message: data.message,
        conversation: data.conversation
      };
    },

    addMessageToConversation: async (
      _source,
      {conversationId, content},
      {dataSources, token},
    ) => {
      // eslint-disable-next-line
      // token = ;
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // In the line below the code retrieves the participants in this conversation
      const participants = await dataSources.conversationAPI.getParticipants({conversationId});

      // participants.participants is an array of usernames
      const status = await Promise.all(participants.participants.map(async (username) => {
        return dataSources.userAPI.getUserStatus({username});
      }));

      // In the line below the code filters to only the online participants of this conversation
      const onlineParticipants = status.filter((user) => user.onlineStatus === true).map((user) => user.username);


      // The lines below do the following:
      // An online user can have an open conversation, in contrast an offline user can not have a conversation open
      // openConversationsByOnlineUsers is an array that gives the online users and the conversation open by that user
      const openConversationsByOnlineUsers = [];
      for (user of onlineParticipants) {
        const currentId = await dataSources.userAPI.getCurrentConversation(user);
        openConversationsByOnlineUsers.push({conversationId: currentId.currentConversation, username: user} );
      }

      const backendResponse =
        await dataSources.conversationAPI.addMessageToConversation({
          validatedUser,
          conversationId,
          content,
          openConversationsByOnlineUsers,
          onlineParticipants,
        });

      const receivers = backendResponse.newMessage.receivers;
      const newMessage = backendResponse.newMessage;

      newMessage.conversationId = conversationId;

      const usersToUpdate = [validatedUser, ...receivers];

      const messageInfo = {
        newMessage: newMessage,
        date: newMessage.date,
        usersToUpdate: usersToUpdate,
      };

      const idsAndParticipants = [{conversationId, participants: usersToUpdate}];

      notifyMessageDelivered(validatedUser, idsAndParticipants);

      notifyNewMessage(messageInfo);

      // To update the conversation Date in the database
      await dataSources.conversationAPI.modifyConversationDate({conversationId});

      // To update the conversation Date in the users profiles:
      await dataSources.userAPI.modifyChatDate({conversationId, participants});

      // Step 3: Call the corresponding method from the conversation data source
      return backendResponse;
    },

    addNameToDeliveredTo: async (
      _source,
      {conversationId, messageIndex, username},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.addNameToDeliveredTo({
        validatedUser,
        conversationId,
        messageIndex,
        username,
      });
    },

    addNameToSeenBy: async (
      _source,
      {conversationId, messageIndex, username},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.addNameToSeenBy({
        validatedUser,
        conversationId,
        messageIndex,
        username,
      });
    },

    createConversation: async (
      _source,
      {name, participants, isGroupalChat},
      {dataSources, token},
    ) => {
      // Step 1: Validate the user operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Remove duplicate participants
      const uniqueParticipants = [...new Set(participants)];

      // Step 3: Validate all unique participants
      await Promise.all(
        uniqueParticipants.map((participant) =>
          dataSources.authAPI.validateMessageReceiver(participant),
        ),
      );

      const validatedUser = validation.validatedUser;

      // Step 4: To validate the profiles of all the participants in this conversation
      await dataSources.userAPI.contactValidator({validatedUser, uniqueParticipants});

      // Step 5: Add the validated user and ensure all participants remain unique
      // The order: validatedUser, ...uniqueParticipants is important to keep the order users are added to chat
      participants = [...new Set([validatedUser, ...uniqueParticipants])];

      // Step 6: To create a new document in the data base for this conversation
      const conversation = await dataSources.conversationAPI.createConversation(
        {
          name,
          validatedUser,
          participants,
          isGroupalChat,
        },
      );

      const conversationId = conversation.conversationId;

      // Step 7: To add the conversation to the profiles of all the participants in this conversation:
      dataSources.userAPI.addChat({
        conversationId,
        name,
        participants,
        isGroupalChat,
        username: validatedUser,
      });

      // Step 8: To extract the information about the conversation that will be used to notify participants
      const conversationInfo =
        await dataSources.conversationAPI.getConversationInfo({
          validatedUser,
          conversationId,
        });


      // Step 9: Notify the participants of the new conversation
      // Assuming conversationId is defined
      conversationInfo.conversationId = conversationId;

      notifyNewConversation(conversationInfo);

      return conversation;
    },

    deleteMessage: async (
      _source,
      {conversationId, messageIndex},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      const deleteMessageResponse = await dataSources.conversationAPI.deleteMessage({
        validatedUser,
        conversationId,
        messageIndex,
      });

      notifyDeletedMessage(conversationId, messageIndex);
      // Step 3: Call the corresponding method from the conversation data source
      return deleteMessageResponse;
    },

    modifyConversationName: async (
      _source,
      {conversationId, newName},
      {dataSources, token},
    ) => {
      // Step 1: Validate the operation for the user using the token
      await dataSources.authAPI.validateUserOperation(token);

      const data = await dataSources.conversationAPI.modifyConversationName({
        conversationId,
        newName,
      });

      const participants = data.participants;

      // TO COMMUNICATE WITH USER SERVICE
      await dataSources.userAPI.modifyChatName({
        conversationId,
        newName,
        participants,
      });

      notifyChatNameChange(newName, conversationId, participants );

      return data.message;
    },

    notifyChatsOfUserConnection: async (
      _source,
      {username, conversationIds},
      {dataSources, token},
    ) => {
      // // Step 1: Validate if the operation is allowed for the user using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.notifyChatsOfUserConnection({
        validatedUser,
        conversationsIDs: conversationIds,
      });
    },

    notifyMessageIsDelivered: async (
      _source,
      {conversationIds, username},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using the token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;

      // Step 3: Call the corresponding method from the conversation data source
      return dataSources.conversationAPI.notifyMessageIsDelivered({
        validatedUser,
        conversationIds,
        username,
      });
    },

    notifyTypingEvent: async (
      _source,
      {username, conversationId, participants},
      {dataSources}
    ) => {
      notifyTypingEvent(username, conversationId, participants);
    },

    removeAdminFromConversation: async (
      _source,
      {conversationId, adminsToRemove},
      {dataSources, token},
    ) => {
      // Step 1: Validate if the operation is allowed for the user by using token
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Step 2: Extract the validated user from the returned object
      const validatedUser = validation.validatedUser;


      // Step 3: Validate adminsToRemove
      await Promise.all(
        adminsToRemove.map((name) =>
          dataSources.authAPI.validateMessageReceiver(name),
        ),
      );

      // Step 4: Call the method from the conversation data source to remove admins
      const removedAdminResponse = await dataSources.conversationAPI.removeAdminFromConversation({
        validatedUser,
        conversationId,
        adminsToRemove: adminsToRemove,
      });

      let {admins, participants} = removedAdminResponse;

      // Check if the admins array is empty and participants is not
      if (admins.length === 0 && participants.length > 0) {
        // Automatically assign the first participant as a new admin
        const newAdmins = [participants[0]];
        const addAdminResponse = await dataSources.conversationAPI.addAdminToConversation({
          validatedUser,
          conversationId,
          newAdmins: newAdmins,
        });
        admins = addAdminResponse.admins;
      }

      // Notify other participants about the admin change
      notifyModifiedAdmin(admins, conversationId, participants);

      // return {admins, participants};
      return removedAdminResponse;
    },

    removeChatMember: async (
      _source,
      {conversationId, nameToRemove},
      {dataSources, token},
    ) => {
      await dataSources.authAPI.validateUserOperation(token);

      const data = await dataSources.conversationAPI.removeChatMember({
        conversationId,
        nameToRemove,
      });

      const participants = data.conversation.participants;

      // TO COMMUNICATE WITH USER SERVICE
      await dataSources.userAPI.removeChatMember({
        conversationId,
        nameToRemove,
        participants,
      });

      // An user removed from the conversation cannot see the conversation anymore:
      // await dataSources.userAPI.deleteChat({conversationId, username: nameToRemove});


      notifyUserRemoved(nameToRemove, conversationId, participants);

      return data;
    },

    removeConversation: async (
      _source,
      {conversationId},
      {dataSources, token},
    ) => {
      // Step 1: Validate the user operation
      await dataSources.authAPI.validateUserOperation(token);


      // Step 3: Remove the conversation
      await dataSources.conversationAPI.removeConversation({conversationId});

      return {success: true, message: "Conversation removed"};
    },


  },
};

module.exports = conversationResolvers;
