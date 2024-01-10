const {withFilter} = require("graphql-subscriptions");

const {pubsub} = require("./pubsub_logic");

const resolvers = {
  Subscription: {
    // ACCEPT CONTACT REQUEST
    acceptedRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_ACCEPTED_REQUEST"]),
        (payload, variables) => {
          return (
            payload.acceptedRequestNotification.sender === variables.username
          );
        },
      ),
      resolve: (payload) => {
        return payload.acceptedRequestNotification;
      },
    },

    // CANCEL REQUEST
    cancelRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_CANCEL_REQUEST"]),
        (payload, variables) => {
          return (
            payload.cancelRequestNotification.receiver === variables.username
          );
        },
      ),
      resolve: (payload) => {
        return payload.cancelRequestNotification;
      },
    },

    // CHANGE USER STATUS
    changeUserStatus: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHANGE_USER_STATUS"]),
        (payload, variables) => {
          const contactListOfLoggedUser = payload.changeUserStatus.contactList;
          const userInSubscription = variables.username;
          return contactListOfLoggedUser.indexOf(userInSubscription) !== -1;
        },
      ),
      resolve: (payload) => {
        return payload.changeUserStatus;
      },
    },

    // CHAT NAME CHANGED
    chatNameChangedNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["CHAT_NAME_CHANGED"]),
        (payload, variables) => {
          // Notification should be sent based on participant usernames only
          return payload.chatNameChangedNotification.participants.includes(variables.username);
        },
      ),
      resolve: (payload) => {
        return payload.chatNameChangedNotification;
      },
    },

    // CONTACT REQUEST
    contactRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_CONTACT_REQUEST"]),
        (payload, variables) => {
          // Only notify the user who received the contact request
          return (
            payload.contactRequestNotification.receiver === variables.username
          );
        },
      ),
      resolve: (payload) => {
        return payload.contactRequestNotification;
      },
    },

    messageDeletedNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_DELETED"]),
        (payload, variables) => {
          return payload.messageDeletedNotification.conversationId === variables.conversationId;
        },
      ),
      resolve: (payload) => {
        return payload.messageDeletedNotification;
      },
    },

    // MESSAGE DELIVERED
    messageDeliveredNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_DELIVERED"]),
        (payload, variables) => {
          // Check if the current user is a participant in any of the conversations
          return payload.messageDeliveredNotification.idsAndParticipants.some((convo) =>
            convo.participants.includes(variables.username)
          );
        },
      ),
      resolve: (payload, args) => {
        // Filter out only those conversations where the current user is a participant
        const filteredConversations = payload.messageDeliveredNotification.idsAndParticipants.filter((convo) =>
          convo.participants.includes(args.username)
        );
        return {
          ...payload.messageDeliveredNotification,
          idsAndParticipants: filteredConversations
        };
      },
    },

    // MESSAGE SEEN
    messagesSeenNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGES_SEEN"]),
        (payload, variables) => {
          return payload.messagesSeenNotification.conversationId === variables.conversationId &&
                 payload.messagesSeenNotification.participants.includes(variables.username);
        },
      ),
      resolve: (payload) => {
        return payload.messagesSeenNotification;
      },
    },

    // //////////////////////////////////////////////////////////////////////////////////////////
    nameChangeContactList: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NAME_CHANGE_CONTACT_LIST"]),
        (payload, variables) => {
          return payload.nameChangeContactList.contactList.includes(variables.username);
        }
      ),
      resolve: (payload) => {
        return payload.nameChangeContactList;
      },
    },

    nameChangeUserConversations: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NAME_CHANGE_USER_CONVERSATIONS"]),
        (payload, variables) => {
          return payload.nameChangeUserConversations.conversations.some((conversationId) =>
            variables.conversationIds.includes(conversationId)
          );
        }
      ),
      resolve: (payload, args) => {
        // Filter the conversations to include only those present in variables.conversationIds
        const filteredConversations = payload.nameChangeUserConversations.conversations.filter((conversationId) =>
          args.conversationIds.includes(conversationId)
        );

        return {
          oldName: payload.nameChangeUserConversations.oldName,
          newName: payload.nameChangeUserConversations.newName,
          conversations: filteredConversations
        };
      },
    },

    nameChangeContactRequest: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NAME_CHANGE_CONTACT_REQUEST"]),
        (payload, variables) => {
          return payload.nameChangeContactRequests.contactRequests.includes(variables.username);
        }
      ),
      resolve: (payload) => {
        return payload.nameChangeContactRequests;
      },
    },
    nameChangePendingContactRequest: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NAME_CHANGE_PENDING_CONTACT_REQUEST"]),
        (payload, variables) => {
          return payload.nameChangePendingContactRequests.pendingContactRequests.includes(variables.username);
        }
      ),
      resolve: (payload) => {
        return payload.nameChangePendingContactRequests;
      },
    },

    nameChangeUserProfile: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NAME_CHANGE_USER_PROFILE"]),
        (payload, variables) => {
          return payload.nameChangeUserProfile.oldName === variables.username ||
                 payload.nameChangeUserProfile.newName === variables.username;
        }
      ),
      resolve: (payload) => {
        return payload.nameChangeUserProfile;
      },
    },
    // //////////////////////////////////////////////////////////////////////////////////////////

    // NEW CONVERSATION
    newConversation: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_CONVERSATION"]),
        (payload, variables) => {
          return payload.newConversation.participants.includes(
            variables.username,
          );
        },
      ),
      resolve: (payload) => {
        return payload.newConversation;
      },
    },

    // NOTIFY_NEW_MESSAGE
    notifyNewMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_NEW_MESSAGE"]),
        (payload, variables) => {
          return payload.newMessageNotification.usersToUpdate.includes(
            variables.username,
          );
        },
      ),
      resolve: (payload) => {
        return payload.newMessageNotification;
      },
    },

    // REJECT CONTACT REQUEST
    rejectedRequestNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NOTIFY_REJECTED_REQUEST"]),
        (payload, variables) => {
          return (
            payload.rejectedRequestNotification.sender === variables.username
          );
        },
      ),
      resolve: (payload) => {
        return payload.rejectedRequestNotification;
      },
    },

    userRemovedNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["USER_REMOVED"]),
        (payload, variables) => {
          // eslint-disable-next-line
          return payload.userRemovedNotification.participants.includes(variables.username) || variables.username ===payload.userRemovedNotification.nameToRemove;
        },
      ),
      resolve: (payload) => {
        return payload.userRemovedNotification;
      },
    },

    typingEventNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["TYPING_EVENT"]),
        (payload, variables) => {
          return payload.typingEventNotification.participants.includes(variables.username);
        },
      ),
      resolve: (payload) => {
        return payload.typingEventNotification;
      },
    },


    adminModifiedNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["ADMIN_MODIFIED"]),
        (payload, variables) => {
          return payload.adminModifiedNotification.participants.includes(variables.username);
        },
      ),
      resolve: (payload) => {
        return payload.adminModifiedNotification;
      },
    },
  },
};

// Export resolvers for use in the GraphQL server
module.exports = resolvers;
