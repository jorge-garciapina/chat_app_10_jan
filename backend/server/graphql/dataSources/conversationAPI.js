const {RESTDataSource} = require("apollo-datasource-rest");

/**
 * ConversationAPI class for handling conversation-related operations.
 */
class ConversationAPI extends RESTDataSource {
  /**
   * Constructor for ConversationAPI.
   */
  constructor() {
    super();
    this.baseURL = process.env.CONVERSATION_SERVICE_CONNECTION;
  }

  /**
   * Function to set headers before sending a request.
   * @param {Object} request The request object to be sent.
   */
  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
  }

  /**
   * Adds administrators to a conversation.
   * @param {Object} adminData Data for adding admins.
   * @return {Promise<Object>} Resolves with the response after adding admins.
   */
  async addAdminToConversation({validatedUser, conversationId, newAdmins}) {
    const response = await this.post("addAdmin", {
      validatedUser,
      conversationId,
      newAdmins,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds a chat member to a conversation.
   * @param {Object} addData Data for adding a chat member.
   * @return {Promise<Object>} Resolves with the response after adding the member.
   */
  async addChatMember({conversationId, namesToAdd}) {
    const response = await this.post("addChatMember", {
      conversationId,
      namesToAdd, // changed from nameToAdd
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }


  /**
   * Adds a message to a conversation.
   * @param {Object} messageData Data for the message to be added.
   * @return {Promise<Object>} Resolves with the response after adding the message.
   */
  async addMessageToConversation({validatedUser,
    conversationId,
    content,
    openConversationsByOnlineUsers,
    onlineParticipants,}) {
    const response = await this.post("addMessageToConversation", {
      validatedUser,
      conversationId,
      content,
      openConversationsByOnlineUsers,
      onlineParticipants,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds a name to the 'deliveredTo' array for a message in a conversation.
   * @param {Object} deliveryData Data for adding a name to the 'deliveredTo' array.
   * @return {Promise<Object>} Resolves with the response after adding the name.
   */
  async addNameToDeliveredTo({
    validatedUser,
    conversationId,
    messageIndex,
    usernames,
  }) {
    const response = await this.post("addNameTodeliveredTo", {
      validatedUser,
      conversationId,
      messageIndex,
      usernames,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds a name to the 'seenBy' array for a message in a conversation.
   * @param {Object} seenData Data for adding a name to the 'seenBy' array.
   * @return {Promise<Object>} Resolves with the response after adding the name.
   */
  async addNameToSeenBy({
    validatedUser,
    conversationId,
    messageIndex,
    username,
  }) {
    const response = await this.post("addNameToseenBy", {
      validatedUser,
      conversationId,
      messageIndex: Number(messageIndex), // Convert to Number
      username,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Creates a new conversation.
   * @param {Object} conversationData Data for creating a new conversation.
   * @return {Promise<Object>} Resolves with the created conversation response.
   */
  async createConversation({
    name,
    validatedUser,
    participants,
    isGroupalChat,
    date,
  }) {
    const response = await this.post("createConversation", {
      name,
      validatedUser,
      participants,
      isGroupalChat,
      date,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Deletes a specific message in a conversation.
   * @param {Object} deleteData Data for deleting a message.
   * @return {Promise<Object>} A promise that resolves with the delete response.
   */
  async deleteMessage({conversationId, messageIndex, validatedUser}) {
    const response = await this.post("/deleteMessage", {
      conversationId,
      messageIndex,
      validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Deletes a specific message in a conversation.
   * @param {Object} deleteData Data for deleting a message.
   * @return {Promise<Object>} A promise that resolves with the delete response.
   */
  async deleteObserver({conversationId, validatedUser}) {
    console.log(conversationId, validatedUser);
    const response = await this.post("/deleteObserver", {
      conversationId: conversationId,
      validatedUser: validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
  /**
   * Fetches information about a specific conversation.
   * @param {Object} conversationData Data to identify the conversation.
   * @return {Promise<Object>} A promise that resolves with the conversation information.
   */
  async getConversationInfo({validatedUser, conversationId}) {
    try {
      // const response = await this.get(`getConversationInfo/${conversationId}`);
      const response = await this.get(`getConversationInfo/${conversationId}?validatedUser=${validatedUser}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Gets the 'deliveredTo' array for a message in a conversation.
   * @param {Object} deliveryData Data to fetch the 'deliveredTo' array.
   * @return {Promise<Object>} A promise that resolves with the 'deliveredTo' array.
   */
  async getDeliveredToArray({validatedUser, conversationId, messageIndex}) {
    try {
      const response = await this.get(
        `getDeliveredTo/${conversationId}/${messageIndex}`,
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        message: "Successfully fetched the deliveredTo array.",
        deliveredTo: response.deliveredTo,
      };
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Fetches the last message of a conversation.
   * @param {string} conversationId The ID of the conversation.
   * @return {Promise<Object>} A promise that resolves with the last message.
   */
  async getLastMessage({validatedUser, conversationId}) {
    try {
      const response = await this.get(`getLastMessage/${conversationId}?validatedUser=${validatedUser}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.lastMessage;
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Fetches information about a specific conversation.
   * @param {Object} conversationData Data to identify the conversation.
   * @return {Promise<Object>} A promise that resolves with the conversation information.
   */
  async getParticipants({conversationId}) {
    try {
      const response = await this.get(`getParticipants/${conversationId}`);

      if (response.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error("API Error:", error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Gets the 'seenBy' array for a message in a conversation.
   * @param {Object} seenData Data to fetch the 'seenBy' array.
   * @return {Promise<Object>} A promise that resolves with the 'seenBy' array.
   */
  async getSeenByArray({validatedUser, conversationId, messageIndex}) {
    try {
      const response = await this.get(
        `getSeenBy/${conversationId}/${messageIndex}`,
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        seenBy: response.seenBy,
      };
    } catch (error) {
      console.error("An error occurred:", error);
      throw new Error(
        "An error occurred while fetching the seenBy array: " + error.message,
      );
    }
  }

  /**
   * Modifies the name of a conversation.
   * @param {Object} modifyData Data for modifying the conversation name.
   * @return {Promise<Object>} Resolves with the response after modifying the name.
   */
  async modifyConversationDate({conversationId}) {
    const response = await this.post("modifyConversationDate", {
      conversationId,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  /**
   * Modifies the name of a conversation.
   * @param {Object} modifyData Data for modifying the conversation name.
   * @return {Promise<Object>} Resolves with the response after modifying the name.
   */
  async modifyConversationName({validatedUser, conversationId, newName}) {
    const response = await this.post("modifyConversationName", {
      validatedUser,
      conversationId,
      newName,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds a name to the 'deliveredTo' array for a message in a conversation.
   * @param {Object} deliveryData Data for adding a name to the 'seenBy' array.
   * @return {Promise<Object>} Resolves with the response after adding the name.
   */
  async notifyChatsOfSeenMessages({
    validatedUser,
    conversationId,
  }) {
    const response = await this.post("notifyChatsOfSeenMessages", {
      validatedUser,
      conversationId,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds a name to the 'deliveredTo' array for a message in a conversation.
   * @param {Object} deliveryData Data for adding a name to the 'deliveredTo' array.
   * @return {Promise<Object>} Resolves with the response after adding the name.
   */
  async notifyChatsOfUserConnection({
    validatedUser,
    conversationsIDs,
  }) {
    const response = await this.post("notifyChatsOfUserConnection", {
      validatedUser,
      conversationsIDs,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Notifies that messages have been delivered for multiple conversations.
   * @param {Object} notificationData Data for the notification of message delivery.
   * @return {Promise<Object>} A promise that resolves with the notification response.
   */
  async notifyMessageIsDelivered({conversationIds, username, validatedUser}) {
    const response = await this.post("notifyMessageIsDelivered", {
      conversationIds,
      username,
      validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Adds administrators to a conversation.
   * @param {Object} adminData Data for adding admins.
   * @return {Promise<Object>} Resolves with the response after adding admins.
   */
  async removeAdminFromConversation({validatedUser, conversationId, adminsToRemove}) {
    const response = await this.post("removeAdmin", {
      validatedUser,
      conversationId,
      adminsToRemove,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  /**
   * Removes a chat member from a conversation.
   * @param {Object} removeData Data for removing a chat member.
   * @return {Promise<Object>} Resolves with the response after removing the member.
   */
  async removeChatMember({validatedUser, conversationId, nameToRemove}) {
    const response = await this.post("removeChatMember", {
      validatedUser,
      conversationId,
      nameToRemove,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Removes a chat member from a conversation.
   * @param {Object} removeData Data for removing a conversation.
   * @return {Promise<Object>} Resolves with the response after removing the member.
   */
  async removeConversation({conversationId}) {
    const response = await this.delete(`removeConversation/${conversationId}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Change the status of a user to offline.
   * @param {Object} userData - Data for the user whose status is to be changed.
   * @return {Promise<Object>} Resolves with the response to the status change.
   */
  async updateUsername({validatedUser, newName}) {
    try {
      const response = await this.put("/updateUsername", {validatedUser, newName});
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      // Handle or forward the error as appropriate for your application
      console.error("Error updating username:", error);
      throw error;
    }
  }
}

module.exports = ConversationAPI;
