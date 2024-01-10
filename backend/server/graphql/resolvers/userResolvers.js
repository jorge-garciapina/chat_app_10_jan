const {
  notifyContactRequest,
  notifyCancelRequest,
  notifyAcceptedRequest,
  notifyRejectedRequest,
  notifyMessageDelivered,
  notifyNameChangeContactRequests,
  notifyNameChangePendingContactRequests,
  notifyNameChangeUserProfile,
  notifyNameChangeContactList,
  notifyNameChangeUserConversations,
} = require("./pubsub_logic");

const userResolvers = {
  Query: {
    // Resolver to get the names of all conversations a user is part of
    getConversations: async (_source, _args, {dataSources, token}) => {
      // Validate user token
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      // Fetch conversations
      const conversationsObj = await dataSources.userAPI.getConversations({
        validatedUser,
      });

      // Using Promise.all to concurrently fetch the last message for each conversation
      const conversationsWithLastMessagePromises = Object.keys(
        conversationsObj
      ).map(async (conversationId) => {
        // Fetch the last message for the current conversation
        const lastMessage = await dataSources.conversationAPI.getLastMessage(
          conversationId
        );

        // Return the conversation with the last message included
        return {
          conversationId: conversationId,
          ...conversationsObj[conversationId],
          lastMessage: lastMessage,
        };
      });

      // Wait for all promises to resolve
      const conversationsArray = await Promise.all(
        conversationsWithLastMessagePromises
      );

      return conversationsArray;
    },

    getUserStatuses: async (_source, {usernames}, {dataSources, token}) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.getUserStatuses({usernames});
    },

    onlineFriends: async (_source, _args, {dataSources, token}) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.getOnlineFriends(validatedUser);
    },

    userInfo: async (_source, _args, {dataSources, token}) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      const data = await dataSources.userAPI.getUserInfo({validatedUser});

      const onlineFriends = await dataSources.userAPI.getOnlineFriends({validatedUser});

      data["onlineFriends"] = onlineFriends;

      const conversationsObj = data.conversations;

      const conversationsWithLastMessagePromises = Object.keys(
        conversationsObj
      ).map(async (conversationId) => {
        const lastMessage = dataSources.conversationAPI.getLastMessage({
          validatedUser,
          conversationId,
        });

        // Return the conversation with the last message included
        return {
          conversationId: conversationId,
          ...conversationsObj[conversationId],
          lastMessage: lastMessage,
        };
      });

      // Wait for all promises to resolve
      const conversationsArray = await Promise.all(
        conversationsWithLastMessagePromises
      );

      data.conversations = conversationsArray;

      // This is to filter the conversations to which the user is a participant
      const filteredConversations = conversationsArray.filter((conversation) =>
        conversation.participants.includes(validatedUser)
      );

      // THE LOGIC BELOW IS TO UPDATE THE deliveredTo ENTRY IN THE CONVERSATIONS ONCE THE USER IS LOGGED IN
      // notifyChatsOfUserConnection IS PUT HERE TO TAKE ADVANTAGE OF conversationsArray AND username BY DOING THAT
      // THERE IS NO NEED TO MAKE MORE OPERATIONS TO RETRIEVE conversationsArray AND username IN OTHER PARTS OF THE CODE
      const conversationIds = filteredConversations.map((conversation) => conversation.conversationId);
      dataSources.conversationAPI.notifyChatsOfUserConnection({
        validatedUser,
        conversationsIDs: conversationIds,
      });


      const idsAndParticipants = filteredConversations.map((conversation) => ({
        conversationId: conversation.conversationId,
        participants: conversation.participants
      }));

      notifyMessageDelivered(validatedUser, idsAndParticipants);
      await dataSources.userAPI.changeUserToOnline({username: validatedUser});
      // To update the current conversation in the user profile
      await dataSources.userAPI.updateCurrentConversation({validatedUser, conversationId: ""});

      return data;
    },

    retrieveContactRequests: async (_source, _args, {dataSources, token}) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrieveContactRequests({validatedUser});
    },

    retrievePendingContactRequests: async (
      _source,
      _args,
      {dataSources, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.retrievePendingContactRequests({
        validatedUser,
      });
    },

    searchUser: async (_source, {searchTerm}, {dataSources, token}) => {
      const validation = await dataSources.authAPI.validateUserOperation(
        token
      );

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.searchUser({searchTerm, validatedUser});
    },
  },

  Mutation: {
    // ACCEPT CONTACT REQUEST
    acceptContactRequest: async (
      _source,
      {senderUsername},
      {dataSources, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      notifyAcceptedRequest(validatedUser, senderUsername);

      const acceptedRequest = await dataSources.userAPI.acceptContactRequest({
        validatedUser,
        senderUsername,
      });

      const onlineFriends = await dataSources.userAPI.getOnlineFriends({validatedUser});

      acceptedRequest["onlineFriends"] = onlineFriends;
      return acceptedRequest;
    },

    // ADD CHAT
    addChat: async (
      _source,
      {conversationId, name, participants, isGroupalChat},
      {dataSources, token}
    ) => {
      // Validate user operation
      const validation = await dataSources.authAPI.validateUserOperation(token);

      // Check validation and extract the validated user
      if (!validation.isValid) {
        return {message: "Unauthorized"};
      }

      const validatedUser = validation.validatedUser;

      try {
        await dataSources.userAPI.addChat({
          conversationId,
          name,
          participants,
          isGroupalChat,
          username: validatedUser,
        });

        return {message: "Chat successfully added"};
      } catch (error) {
        return {message: `Failed to add chat: ${error.message}`};
      }
    },

    // CANCEL REQUEST
    cancelRequest: async (
      _source,
      {receiverUsername},
      {dataSources, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      notifyCancelRequest(validatedUser, receiverUsername);

      return dataSources.userAPI.cancelRequest({
        validatedUser,
        receiverUsername,
      });
    },

    // CHANGE USER TO OFFLINE
    changeUserToOffline: async (
      _source,
      {username},
      {dataSources, token}
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOffline({username});
    },

    // CHANGE AVATAR IMAGE
    changeAvatarImage: async (
      _source,
      {username, avatarImage},
      {dataSources, token}
    ) => {
      console.log("changeAvatarImage");
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.changeAvatarImage({validatedUser, avatarImage});
    },

    // CHANGE USER TO ONLINE
    changeUserToOnline: async (
      _source,
      {username},
      {dataSources, token}
    ) => {
      await dataSources.authAPI.validateUserOperation(token);
      return dataSources.userAPI.changeUserToOnline({username});
    },

    // CREATE USER
    createUser: async (
      _source,
      {email, username, avatar, contactList},
      {dataSources}
    ) => {
      return dataSources.userAPI.createUser({
        email,
        username,
        avatar,
        contactList,
      });
    },

    // DELETE CHAT
    deleteChat: async (
      _source,
      {conversationId, username},
      {dataSources, token},
    ) => {
      // Step 1: Validate the user operation
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;

      // Step 2: Validate if the user has permission to delete the chat
      if (validatedUser !== username) {
        throw new Error("User not authorized to delete this chat");
      }

      // Step 3: Delete the chat from the user's profile
      await dataSources.userAPI.deleteChat({conversationId, username});

      const {observers} = await dataSources.conversationAPI.deleteObserver({conversationId, validatedUser});

      // If there are no observers, then the conversation can be deleted
      if (observers.length === 0) {
        dataSources.conversationAPI.removeConversation({conversationId});
      }

      return {success: true, message: "Chat deleted from user profile"};
    },

    // DELETE CONTACT
    deleteContact: async (
      _source,
      {receiverUsername},
      {dataSources, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      return dataSources.userAPI.deleteContact({
        validatedUser,
        receiverUsername,
      });
    },

    // REJECT CONTACT REQUEST
    rejectContactRequest: async (
      _source,
      {senderUsername},
      {dataSources, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);
      const validatedUser = validation.validatedUser;
      notifyRejectedRequest(validatedUser, senderUsername);
      return dataSources.userAPI.rejectContactRequest({
        validatedUser,
        senderUsername,
      });
    },

    // SEND CONTACT REQUEST
    sendContactRequest: async (
      _source,
      {receiverUsername},
      {dataSources, token}
    ) => {
      // eslint-disable-next-line
      // token = "";
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      const sendRequest = await dataSources.userAPI.sendContactRequest({
        validatedUser,
        receiverUsername,
      });

      if (sendRequest.isRequestSent) {
        notifyContactRequest(validatedUser, receiverUsername);
      }

      return sendRequest;
    },

    updateUsername: async (
      _source,
      {newName},
      {dataSources, res, token}
    ) => {
      const validation = await dataSources.authAPI.validateUserOperation(token);

      const validatedUser = validation.validatedUser;

      // To get the array of users that have sent a contact request to this user
      const contactRequests = await dataSources.userAPI.retrieveContactRequests({validatedUser});
      // To get the array of users that have recieved a contact request from this user
      const pendingContactRequests = await dataSources.userAPI.retrievePendingContactRequests({validatedUser});

      // 1 userA sent a request to validatedUser
      // 2 validatedUser change name to newName
      // 3 The code must notify to userA that validatedUser is now newName
      // 4 we use notifyNameChangeContactRequests to do so
      // 5 when recieved, notifyNameChangeContactRequests will modify the *pendingCR*
      //   entry of userA in the redux state
      notifyNameChangeContactRequests({oldName: validatedUser, newName, contactRequests});

      // 1 validatedUser sent a request to userA
      // 2 validatedUser change name to newName
      // 3 The code must notify to userA that validatedUser is now newName
      // 4 we use notifyNameChangePendingContactRequests to do so
      // 5 when recieved, notifyNameChangePendingContactRequests will modify the *contactRequests*
      //   entry of userA in the redux state
      notifyNameChangePendingContactRequests({oldName: validatedUser, newName, pendingContactRequests});

      const contactListResponse = await dataSources.userAPI.getContactList(validatedUser);
      const contactList = contactListResponse.contactList;
      notifyNameChangeContactList({oldName: validatedUser, newName, contactList});


      // CHANGES IN THE DATABASES:
      // USER DATABASE:
      await dataSources.userAPI.updateUsername({validatedUser, newName});
      notifyNameChangeUserProfile({oldName: validatedUser, newName});

      // AUTH DATABASE:
      const updateUsernameAuth = await dataSources.authAPI.updateUsername({validatedUser, newName});
      res.cookie("authToken", updateUsernameAuth.token, {
        httpOnly: true,
      });

      // CONVERSATION DATABASE
      await dataSources.conversationAPI.updateUsername({validatedUser, newName});
      const conversations = await dataSources.userAPI.getConversationsIds({validatedUser: newName});
      notifyNameChangeUserConversations({oldName: validatedUser, newName, conversations});

      return "updateUsername";
    },
    // //////////////////////////////////////////////////////////////////////////////////////////////////////
  },
};

module.exports = userResolvers;
