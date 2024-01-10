const {PubSub} = require("graphql-subscriptions");

// Initialize the PubSub instance for real-time updates
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30);

// CHANGE USER STATUS
/**
 * Changes the online status of a user and notifies relevant contacts.
 * @param {string} username - The username of the user.
 * @param {Array} contactList - The list of contacts to notify.
 * @param {string} status - The new status of the user.
 * @return {Object} The user status information.
 */
function changeUserStatus(username, contactList, status) {
  pubsub.publish("CHANGE_USER_STATUS", {
    changeUserStatus: {username, status, contactList},
  });

  return {username, status, contactList};
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// NOTIFY NAME CHANGE
/**
 * Notifies users about a new conversation.
 * @param {Object} nameChangeInfo - The information used to notify name change
 */
function notifyNameChangeContactRequests(nameChangeInfo) {
  pubsub.publish("NAME_CHANGE_CONTACT_REQUEST", {
    nameChangeContactRequests: nameChangeInfo,
  });
}

/**
 * Notifies users about a new conversation.
 * @param {Object} nameChangeInfo - The information used to notify name change
 */
function notifyNameChangePendingContactRequests(nameChangeInfo) {
  pubsub.publish("NAME_CHANGE_PENDING_CONTACT_REQUEST", {
    nameChangePendingContactRequests: nameChangeInfo,
  });
}

/**
 * Notifies users in a contact list about a user's name change.
 * @param {Object} nameChangeInfo - The information about the user's name change.
 */
function notifyNameChangeContactList(nameChangeInfo) {
  pubsub.publish("NAME_CHANGE_CONTACT_LIST", {
    nameChangeContactList: nameChangeInfo,
  });
}

/**
 * Notifies users about a user's name change in specific conversations.
 * @param {Object} nameChangeInfo - The information about the user's name change.
 */
function notifyNameChangeUserConversations(nameChangeInfo) {
  pubsub.publish("NAME_CHANGE_USER_CONVERSATIONS", {
    nameChangeUserConversations: nameChangeInfo,
  });
}

/**
 * Notifies about the name change in user profile.
 * @param {Object} nameChangeInfo - The information about the user's name change.
 */
function notifyNameChangeUserProfile(nameChangeInfo) {
  pubsub.publish("NAME_CHANGE_USER_PROFILE", {
    nameChangeUserProfile: nameChangeInfo,
  });
}
// ///////////////////////////////////////////////////////////////////////////////////////////////////

// NOTIFY ACCEPTED REQUEST
/**
 * Notifies when a contact request is accepted.
 * @param {string} validatedUser - The user who accepted the contact request.
 * @param {string} senderUsername - The username of the sender of the contact request.
 */
function notifyAcceptedRequest(validatedUser, senderUsername) {
  pubsub.publish("NOTIFY_ACCEPTED_REQUEST", {
    acceptedRequestNotification: {
      receiver: validatedUser,
      sender: senderUsername,
    },
  });
}

// NOTIFY CANCEL REQUEST
/**
 * Notifies a user when a contact request is cancelled.
 * @param {string} validatedUser - The user who sent the contact request.
 * @param {string} receiverUsername - Receiver of the cancelled request.
 */
function notifyCancelRequest(validatedUser, receiverUsername) {
  pubsub.publish("NOTIFY_CANCEL_REQUEST", {
    cancelRequestNotification: {
      sender: validatedUser,
      receiver: receiverUsername,
    },
  });
}

// NOTIFY CHAT NAME CHANGE
/**
 * Notifies users that a message has been delivered.
 * @param {String} newName - The new name of the conversation
 * @param {String} conversationId - Array of objects containing conversationId and participants.
 * @param {String} participants - Array of objects containing conversationId and participants.
 *
 */
function notifyChatNameChange(newName, conversationId, participants) {
  pubsub.publish("CHAT_NAME_CHANGED", {
    chatNameChangedNotification: {
      newName,
      conversationId,
      participants,
    },
  });
}

// NOTIFY MESSAGE SEEN
/**
 * Notifies users that a message has been delivered.
 * @param {String} conversationId - Conversation ID of the conversation
 * @param {String} validatedUser - Username of the user that sends the subscription
 * @param {String} participants - Array of objects containing the participants in the conversation
 *
 */
function notifyChatsOfSeenMessagesSubs(conversationId, validatedUser, participants) {
  pubsub.publish("MESSAGES_SEEN", {
    messagesSeenNotification: {
      conversationId,
      validatedUser,
      participants,
    },
  });
}

// NOTIFY DELETED MESSAGE
/**
 * Notifies users that a message has been delivered.
 * @param {String} conversationId - The username of the user who logged in.
 * @param {String} messageIndex - Array of objects containing conversationId and participants.
 *
 */
function notifyDeletedMessage(conversationId, messageIndex) {
  pubsub.publish("MESSAGE_DELETED", {
    messageDeletedNotification: {
      conversationId,
      messageIndex,
    },
  });
}

// NOTIFY CONTACT REQUEST
/**
 * Notifies a user about a new contact request.
 * @param {string} validatedUser - The user who has received the contact request.
 * @param {string} receiverUsername - The username of the receiver of the contact request.
 */
function notifyContactRequest(validatedUser, receiverUsername) {
  pubsub.publish("NOTIFY_CONTACT_REQUEST", {
    contactRequestNotification: {
      sender: validatedUser,
      receiver: receiverUsername,
    },
  });
}

// NOTIFY NEW CONVERSATION
/**
 * Notifies users about a new conversation.
 * @param {Object} conversation - The conversation object.
 */
function notifyNewConversation(conversation) {
  pubsub.publish("NEW_CONVERSATION", {
    newConversation: conversation,
  });
}

// NOTIFY NEW MESSAGE
/**
 * Notifies users about a new message in a conversation.
 * @param {Object} messageInfo - Information about the new message.
 */
function notifyNewMessage(messageInfo) {
  pubsub.publish("NOTIFY_NEW_MESSAGE", {
    newMessageNotification: messageInfo,
  });
}

// NOTIFY REJECTED REQUEST
/**
 * Notifies when a contact request is rejected.
 * @param {string} validatedUser - The user who rejected the contact request.
 * @param {string} senderUsername - The username of the sender of the contact request.
 */
function notifyRejectedRequest(validatedUser, senderUsername) {
  pubsub.publish("NOTIFY_REJECTED_REQUEST", {
    rejectedRequestNotification: {
      receiver: validatedUser,
      sender: senderUsername,
    },
  });
}

// NOTIFY MESSAGE DELIVERED
/**
 * Notifies users that a message has been delivered.
 * @param {String} validatedUser - The username of the user who logged in.
 * @param {Array} idsAndParticipants - Array of objects containing conversationId and participants.
 */
function notifyMessageDelivered(validatedUser, idsAndParticipants) {
  pubsub.publish("MESSAGE_DELIVERED", {
    messageDeliveredNotification: {
      validatedUser,
      idsAndParticipants
    },
  });
}

// NOTIFY MODIFIED ADMIN
/**
 * Notifies users that a message has been delivered.
 * @param {String} admins - New admins of the conversation
 * @param {String} conversationId - The id od the conversation.
 * @param {String} participants - Array of participants.
 *
 */
function notifyModifiedAdmin(admins, conversationId, participants) {
  pubsub.publish("ADMIN_MODIFIED", {
    adminModifiedNotification: {
      admins,
      conversationId,
      participants,
    },
  });
}

// NOTIFY TYPING EVENT
/**
 * Notifies users that a message has been delivered.
 * @param {String} username - The user that is typing
 * @param {String} conversationId - The id od the conversation.
 * @param {String} participants - Array of participants.
 *
 */
function notifyTypingEvent(username, conversationId, participants) {
  pubsub.publish("TYPING_EVENT", {
    typingEventNotification: {
      username,
      conversationId,
      participants,
    },
  });
}


// NOTIFY USER REMOVED
/**
 * Notifies users that a message has been delivered.
 * @param {String} nameToRemove - The user to remove
 * @param {String} conversationId - The id od the conversation.
 * @param {String} participants - Array of participants.
 *
 */
function notifyUserRemoved(nameToRemove, conversationId, participants) {
  pubsub.publish("USER_REMOVED", {
    userRemovedNotification: {
      nameToRemove,
      conversationId,
      participants,
    },
  });
}

// Export all necessary variables as a single object
module.exports = {
  pubsub,
  changeUserStatus,
  notifyAcceptedRequest,
  notifyCancelRequest,
  notifyChatNameChange,
  notifyChatsOfSeenMessagesSubs,
  notifyContactRequest,
  notifyDeletedMessage,
  notifyNewConversation,
  notifyNewMessage,
  notifyMessageDelivered,
  notifyModifiedAdmin,
  notifyRejectedRequest,
  notifyTypingEvent,
  notifyUserRemoved,
  notifyNameChangeContactRequests,
  notifyNameChangePendingContactRequests,
  notifyNameChangeUserProfile,
  notifyNameChangeContactList,
  notifyNameChangeUserConversations,
};
