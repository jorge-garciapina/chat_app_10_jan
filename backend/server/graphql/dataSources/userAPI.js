const {RESTDataSource} = require("apollo-datasource-rest");

/**
 * UserService class for handling user-related operations.
 */
class UserService extends RESTDataSource {
  /**
   * Constructor for UserService.
   */
  constructor() {
    super();
    this.baseURL = process.env.USER_SERVICE_CONNECTION;
  }

  /**
   * Set headers before sending a request.
   * @param {Object} request The request object to be sent.
   */
  willSendRequest(request) {
    request.headers.set("Authorization", this.context.token);
  }

  /**
   * Accept a contact request from another user.
   * @param {Object} requestData - Data for accepting the contact request.
   * @return {Promise<Object>} Resolves with the response to accepting the request.
   */
  async acceptContactRequest({validatedUser, senderUsername}) {
    const response = await this.post("acceptContactRequest", {
      validatedUser,
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }


  /**
   * Add a new chat to the conversation.
   * @param {Object} chatData - Data for the new chat.
   * @return {Promise<Object>} Resolves with the response to adding the new chat.
   */
  async addChat({
    conversationId,
    name,
    participants,
    isGroupalChat,
    username,
  }) {
    const response = await this.post("addChat", {
      conversationId,
      name,
      participants,
      isGroupalChat,
      username,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Add a new member to a chat in a conversation.
   * @param {Object} memberData - Data for adding the new member.
   * @return {Promise<Object>} Resolves with the response to adding the new member.
   */
  async addChatMember({
    conversationId,
    nameToAdd,
    participants,
    conversation,
  }) {
    // Make a POST request to add a new chat member
    const response = await this.post("addChatMember", {
      conversationId,
      nameToAdd,
      participants,
      conversation, // Added the conversation data
    });

    // Error Handling: Throw an error if the service returns one
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Cancel a sent contact request.
   * @param {Object} requestData - Data for canceling the request.
   * @return {Promise<Object>} Resolves with the response to canceling the request.
   */
  async cancelRequest({validatedUser, receiverUsername}) {
    const response = await this.post("cancelRequest", {
      validatedUser,
      receiverUsername,
    });

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
  async changeUserToOffline({username}) {
    const response = await this.patch("changeUserToOffline", {username});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Change the status of a user to online.
   * @param {Object} userData - Data for the user whose status is to be changed.
   * @return {Promise<Object>} Resolves with the response to the status change.
   */
  async changeUserToOnline({username}) {
    const response = await this.patch("changeUserToOnline", {username});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
 * Change the avatar image of a user.
 * @param {Object} userData - Data for the user whose avatar is to be changed.
 * @return {Promise<Object>} Resolves with the response to the avatar change.
 */
  async changeAvatarImage({validatedUser, avatarImage}) {
    const response = await this.patch("changeAvatarImage", {validatedUser, avatarImage});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Create a new user.
   * @param {Object} userData - Data for creating a new user.
   * @return {Promise<Object>} Resolves with the newly created user.
   */
  async createUser({email, username, avatar, contactList}) {
    const response = await this.post("create", {
      email,
      username,
      avatar,
      contactList,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  /**
   * Change the status of a user to online.
   * @param {Object} userData - Data for the chat to delete
   * @return {Promise<Object>} Resolves with the response to the status change.
   */
  async deleteChat({conversationId, username}) {
    const response = await this.delete(`deleteChat/${conversationId}/${username}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Delete a contact from the user's contact list.
   * @param {Object} deleteData - Data for deleting the contact.
   * @return {Promise<Object>} Resolves with the response to the delete action.
   */
  async deleteContact({validatedUser, receiverUsername}) {
    const response = await this.post("deleteContact", {
      validatedUser,
      receiverUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Get all users.
   * @return {Promise<Array>} Resolves with the list of users.
   */
  async getUsersUser() {
    return this.get("usersUser");
  }


  /**
   * Get information of a specific user.
   * @param {Object} userInfo - Data to identify the user.
   * @return {Promise<Object>} Resolves with the user contact list.
   */
  async contactValidator({validatedUser, uniqueParticipants}) {
    const response = await this.post("contactValidator", {validatedUser, uniqueParticipants});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Retrieve conversations for a user.
   * @param {Object} conversationData - Data to identify the user.
   * @return {Promise<Array>} Resolves with the user's conversations.
   */
  async getConversations({validatedUser}) {
    const response = await this.get("getConversations", {validatedUser});

    if (response.error) {
      throw new Error(response.error);
    }

    return response.conversations;
  }

  /**
   * Retrieve conversations for a user.
   * @param {Object} conversationData - Data to identify the user.
   * @return {Promise<Array>} Resolves with the user's conversations.
   */
  async getConversationsIds({validatedUser}) {
    const response = await this.get("getConversationsIds", {validatedUser});

    if (response.error) {
      throw new Error(response.error);
    }

    return response.conversations;
  }

  /**
   * Add a new member to a chat in a conversation.
   * @param {Object} validatedUser - Data for adding the new member.
   * @return {Promise<Object>} Resolves with the response to adding the new member.
   */
  async getContactList(validatedUser) {
    // const response = await this.get("getCurrentConversation", validatedUser);
    const response = await this.get(`getContactList/${validatedUser}`);
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  /**
   * Add a new member to a chat in a conversation.
   * @param {Object} validatedUser - Data for adding the new member.
   * @return {Promise<Object>} Resolves with the response to adding the new member.
   */
  async getCurrentConversation(validatedUser) {
    // const response = await this.get("getCurrentConversation", validatedUser);
    const response = await this.get(`getCurrentConversation/${validatedUser}`);


    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Get the list of online friends.
   * @param {string} validatedUser - Identifier for the user.
   * @return {Promise<Array>} Resolves with the list of online friends.
   */
  async getOnlineFriends({validatedUser}) {
    const response = await this.get(`onlineFriends/${validatedUser}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.onlineFriends;
  }

  /**
   * Get information of a specific user.
   * @param {Object} userInfo - Data to identify the user.
   * @return {Promise<Object>} Resolves with the user information.
   */
  async getUserInfo({validatedUser}) {
    const response = await this.get(`info/${validatedUser}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Change the status of a user to offline.
   * @param {Object} validatedUser - Data for the user whose status is to be changed.
   * @return {Promise<Object>} Resolves with the response to the status change.
   */
  async getUserStatus({username}) {
    const response = await this.get(`getUserStatus/${username}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }


  /**
   * Get the online statuses of multiple users.
   * @param {Object} statusData - Data for fetching the statuses.
   * @return {Promise<Object>} Resolves with the online statuses.
   */
  async getUserStatuses({usernames}) {
    const response = await this.post("getUserStatuses", {usernames});

    if (response.error) {
      throw new Error(response.error);
    }

    return response.onlineStatuses;
  }

  /**
   * Modify the name of a chat in a conversation.
   * @param {Object} modifyData - Data for modifying the chat name.
   * @return {Promise<Object>} Resolves with the response to modifying the chat name.
   */
  async modifyChatDate({conversationId, participants}) {
    const response = await this.post("modifyChatDate", {
      conversationId,
      participants: participants.participants,
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  }

  /**
   * Modify the name of a chat in a conversation.
   * @param {Object} modifyData - Data for modifying the chat name.
   * @return {Promise<Object>} Resolves with the response to modifying the chat name.
   */
  async modifyChatName({conversationId, newName, participants}) {
    const response = await this.post("modifyChatName", {
      conversationId,
      newName,
      participants,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Reject a contact request from another user.
   * @param {Object} requestData - Data for rejecting the contact request.
   * @return {Promise<Object>} Resolves with the response to rejecting the request.
   */
  async rejectContactRequest({validatedUser, senderUsername}) {
    const response = await this.post("rejectContactRequest", {
      validatedUser,
      senderUsername,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Add a new member to a chat in a conversation.
   * @param {Object} chatFata - Data for adding the new member.
   * @return {Promise<Object>} Resolves with the response to adding the new member.
   */
  async removeChatMember({conversationId, nameToRemove, participants}) {
    // Make a POST request to remove a chat member
    const response = await this.post("removeChatMember", {
      conversationId,
      nameToRemove,
      participants,
    });

    // Error Handling: Throw an error if the service returns one
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Retrieve contact requests.
   * @param {Object} requestData - Data to identify the user.
   * @return {Promise<Array>} Resolves with the contact requests.
   */
  async retrieveContactRequests({validatedUser}) {
    const response = await this.get(`retrieveContactRequests/${validatedUser}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Retrieve pending contact requests.
   * @param {Object} requestData - Data to identify the user.
   * @return {Promise<Array>} Resolves with the pending contact requests.
   */
  async retrievePendingContactRequests({validatedUser}) {
    const response = await this.get(
      `retrievePendingContactRequests/${validatedUser}`,
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Search for a user.
   * @param {Object} searchData - Data for the search criteria.
   * @return {Promise<Array>} Resolves with the search results.
   */
  async searchUser({searchTerm, validatedUser}) {
    const response = await this.post("searchUser", {
      searchTerm,
      validatedUser,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Send a contact request to another user.
   * @param {Object} requestData - Data for the contact request.
   * @return {Promise<Object>} Resolves with the response to the contact request.
   */
  async sendContactRequest({validatedUser, receiverUsername}) {
    const response = await this.post("sendContactRequest", {
      validatedUser,
      receiverUsername,
    });

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
  async updateCurrentConversation({validatedUser, conversationId}) {
    const response = await this.patch("updateCurrentConversation", {validatedUser, conversationId});

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

module.exports = UserService;
