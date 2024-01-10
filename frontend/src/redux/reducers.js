const initialState = {
  isAuthenticated: false,
  userInfo: {
    username: null,
    avatarImage: null,
    contactList: [],
    pendingCR: [],
    contactRequests: [],
  },
  onlineFriends: [],
  notifications: [],
  conversation: {
    name: null,
    isGroupalChat: null,
    conversationId: null,
    interlocutors: [],
    participants: [],
    messages: [],
    admins: [],
    usersTyping: []
  },
  conversations: [],
};
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
  case "ADD_CONTACT_REQUEST":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        // Append the new contact request to the array
        contactRequests: [
          ...state.userInfo.contactRequests,
          action.payload.newContactRequest,
        ],
      },
    };

  case "ADD_NAME_TO_USER_TYPING":
    const usersTyping = state.conversation.usersTyping;
    if (!usersTyping.includes(action.payload.username)) {
      return {
        ...state,
        conversation: {
          ...state.conversation,
          usersTyping: [...usersTyping, action.payload.username] // Create a new array with the new username
        },
      };
    }
    return state;

  case "DELETE_NAME_FROM_USER_TYPING": {
    const index = state.conversation.usersTyping.indexOf(action.payload.username);
    if (index !== -1) {
      return {
        ...state,
        conversation: {
          ...state.conversation,
          usersTyping: [
            ...state.conversation.usersTyping.slice(0, index),
            ...state.conversation.usersTyping.slice(index + 1)
          ]
        },
      };
    }
    return state;
  }


  case "ADD_NEW_CONVERSATION": {
    const {newConversation} = action.payload;
    return {
      ...state,
      conversations: [newConversation, ...state.conversations],
    };
  }


  case "ADD_TO_CONTACT_LIST":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        contactList: [
          ...state.userInfo.contactList,
          action.payload.newContact,
        ],
      },
    };

  case "APPEND_MESSAGE":
    const {message} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        messages: [...state.conversation.messages, message],
      },
    };

  case "MODIFY_MESSAGE_VISIBILITY": {
    const {conversationId, messageIndex} = action.payload;
    // Ensure that the action is for the current conversation
    if (state.conversation.conversationId !== conversationId) {
      return state;
    }

    // Copy the messages array to avoid mutating the original state directly
    const updatedMessages = state.conversation.messages.map((message) =>
      message.index.toString() === messageIndex ? {...message, isVisible: false} : message
    );

    const updatedState = {
      ...state,
      conversation: {
        ...state.conversation,
        messages: updatedMessages,
      },
    };

    return updatedState;
  }

  case "AUTHENTICATE_USER":
    return {
      ...state,
      isAuthenticated: action.payload,
    };

  case "CANCEL_CONTACT_REQUEST":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        pendingCR: state.userInfo.pendingCR.filter(
          (u) => u !== action.payload.username
        ),
      },
    };

  case "DEFINE_ADMINS": {
    const {admins} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        admins,
      },
    };
  }

  case "DEFINE_USERS_TYPING": {
    // const {admins} = action.payload.usersTyping;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        usersTyping: action.payload.usersTyping,
      },
    };
  }

  case "DEFINE_CONVERSATION_NAME": {
    const {name} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        name,
      },
    };
  }

  case "DEFINE_CONVERSATION_TYPE": {
    const {isGroupalChat} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        isGroupalChat,
      },
    };
  }

  case "DEFINE_INTERLOCUTOR": {
    const {interlocutors} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        interlocutors,
      },
    };
  }

  case "DEFINE_PARTICIPANT": {
    const {participants} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        participants,
      },
    };
  }

  case "DEFINE_PARTICIPANTS_IN_CONVERSATIONS_ARRAY":
    return {
      ...state,
      conversations: state.conversations.map((conversation) => {
        if (conversation.conversationId === action.payload.conversationId) {
          // Update only the conversation that matches the current conversation ID
          return {
            ...conversation,
            participants: action.payload.participants,
          };
        }
        return conversation;
      }),
    };

  case "DEFINE_NAME_IN_CONVERSATIONS_ARRAY":
    return {
      ...state,
      conversations: state.conversations.map((conversation) => {
        if (conversation.conversationId === action.payload.conversationId) {
          // Update only the conversation that matches the current conversation ID
          return {
            ...conversation,
            name: action.payload.name,
          };
        }
        return conversation;
      }),
    };

  case "INTERLOCUTOR_IS_ONLINE":
    const onlineUser = action.payload.interlocutor;
    // Check if interlocutor is not already in onlineFriends
    if (!state.onlineFriends.includes(onlineUser)) {
      return {
        ...state,
        onlineFriends: [...state.onlineFriends, onlineUser],
      };
    }
    return state;

  case "LOGIN":
    const newUser = action.payload.username;
    // Create a new notification when a user logs in
    const newNotification = {
      message: `${newUser} is online`,
    };
    // Check if the notification already exists in the notifications array
    const notificationExists = state.notifications.some(
      (notification) => notification.message === newNotification.message
    );
    let updatedNotifications = state.notifications;
    if (!notificationExists) {
      updatedNotifications = [...state.notifications, newNotification];
    }
    if (!newUser) {
      updatedNotifications = [...state.notifications];
    }
    // Check if the username already exists in onlineFriends
    if (!state.onlineFriends.includes(newUser) && !!newUser) {
      return {
        ...state,
        username: newUser,
        onlineFriends: [...state.onlineFriends, newUser],
        notifications: updatedNotifications,
      };
    } else {
      // If the user is already in the onlineFriends array, return the state with possibly updated notifications
      return {
        ...state,
        username: newUser,
        notifications: updatedNotifications,
      };
    }

  case "LOGOUT":
    const logoutUser = action.payload.username;
    if (state.onlineFriends.includes(logoutUser)) {
      const updatedUsers = state.onlineFriends.filter(
        (user) => user !== logoutUser
      );
      return {
        ...state,
        username: null,
        onlineFriends: updatedUsers,
      };
    } else {
      return state;
    }

  case "MODIFY_CONVERSATION_DATE": {
    const {conversationId, date} = action.payload;
    return {
      ...state,
      conversations: state.conversations.map(
        (conversation) =>
          conversation.conversationId === conversationId ? {...conversation, date: date} : conversation
      ),
    };
  }

  case "MODIFY_CONVERSATION_NAME": {
    const {newName, conversationId} = action.payload;
    return {
      ...state,
      conversations: state.conversations.map(
        (conversation) =>
          conversation.conversationId === conversationId ? {...conversation, name: newName} : conversation
      ),
    };
  }

  case "REMOVE_CONTACT_REQUEST":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        contactRequests: state.userInfo.contactRequests.filter(
          (contactRequest) =>
            contactRequest !== action.payload.contactRequestToRemove
        ),
      },
    };

  case "REMOVE_CONVERSATION":
    const {conversationId} = action.payload;
    return {
      ...state,
      conversations: state.conversations.filter((convo) => convo.conversationId !== conversationId),
    };

  case "REMOVE_PENDING_CONTACT_REQUEST":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        pendingCR: state.userInfo.pendingCR.filter(
          (pendingCR) =>
            pendingCR !== action.payload.pendingContactRequestToRemove
        ),
      },
    };

  case "SET_SELECTED_CONVERSATION_ID":
    return {
      ...state,
      conversation: {
        ...state.conversation,
        conversationId: action.payload.conversationId,
      },
    };

  case "SET_TO_INITIAL_STATE":
    return initialState;

  case "UPDATE_CONVERSATIONS":
    const {conversations} = action.payload;
    return {
      ...state,
      conversations,
    };

  case "UPDATE_DELIVERED_TO_IN_CONVERSATION":
    const {validatedUser} = action.payload;
    const updatedMessages = state.conversation.messages.map((message) => {
      if (!message.deliveredTo.includes(validatedUser) && message.receivers.includes(validatedUser)) {
        const usersWhoRecievedMessage = [...message.deliveredTo, validatedUser];
        const deliveredToAllReceivers = message.receivers.length === usersWhoRecievedMessage.length &&
        usersWhoRecievedMessage.every((element) => message.receivers.includes(element));
        return {
          ...message,
          deliveredTo: usersWhoRecievedMessage,
          deliveredToAllReceivers: deliveredToAllReceivers,
        };
      }
      return message;
    });
    return {
      ...state,
      conversation: {
        ...state.conversation,
        messages: updatedMessages
      },
    };

  case "UPDATE_LAST_MESSAGE": {
    const {conversationId, lastMessage} = action.payload;
    return {
      ...state,
      conversations: state.conversations.map(
        (conversation) =>
          conversation.conversationId === conversationId ? {...conversation, lastMessage}: conversation
      ),
    };
  }

  case "UPDATE_MESSAGES":
    const {messages} = action.payload;
    return {
      ...state,
      conversation: {
        ...state.conversation,
        messages,
      },
    };

  case "UPDATE_NAME_IN_ONLINE_FRIENDS": {
    const {oldName, newName} = action.payload;
    return {
      ...state,
      onlineFriends: state.onlineFriends.map((name) =>
        name === oldName ? newName : name
      ),
    };
  }

  case "UPDATE_NAME_IN_CONTACT_LIST": {
    const {oldName, newName} = action.payload;
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        contactList: state.userInfo.contactList.map((name) =>
          name === oldName ? newName : name
        ),
      },
    };
  }

  case "UPDATE_USERNAME_IN_CONVERSATION": {
    const {oldName, newName} = action.payload;
    const {conversation} = state;

    // Update the conversation name if isGroupalChat is false and name matches oldName
    const updatedName = !conversation.isGroupalChat && conversation.name === oldName ? newName : conversation.name;

    // Update interlocutors, participants, and admins
    const updatedInterlocutors = conversation.interlocutors.map((user) => user === oldName ? newName : user);
    const updatedParticipants = conversation.participants.map((user) => user === oldName ? newName : user);
    const updatedAdmins = conversation.admins.map((user) => user === oldName ? newName : user);

    // Update messages
    const updatedMessages = conversation.messages.map((message) => ({
      ...message,
      deliveredTo: message.deliveredTo.map((user) => user === oldName ? newName : user),
      receivers: message.receivers.map((user) => user === oldName ? newName : user),
      seenBy: message.seenBy.map((user) => user === oldName ? newName : user),
      sender: message.sender === oldName ? newName : message.sender,
    }));

    return {
      ...state,
      conversation: {
        ...conversation,
        name: updatedName,
        interlocutors: updatedInterlocutors,
        participants: updatedParticipants,
        admins: updatedAdmins,
        messages: updatedMessages
      }
    };
  }


  case "UPDATE_USERNAME_IN_CONVERSATIONS_ARRAY": {
    const {oldName, newName, conversations} = action.payload;
    return {
      ...state,
      conversations: state.conversations.map((conversation) => {
        if (conversations.includes(conversation.conversationId)) {
          // Update conversation name if isGroupalChat is false
          const updatedName = !conversation.isGroupalChat && conversation.name === oldName ?
            newName : conversation.name;

          // Update participants
          const updatedParticipants = conversation.participants.map((participant) =>
            participant === oldName ? newName : participant
          );

          // Update lastMessage sender
          const updatedLastMessage = conversation.lastMessage && conversation.lastMessage.sender === oldName?
            {...conversation.lastMessage, sender: newName}:
            conversation.lastMessage;

          return {
            ...conversation,
            name: updatedName,
            participants: updatedParticipants,
            lastMessage: updatedLastMessage
          };
        }
        return conversation;
      }),
    };
  }


  case "UPDATE_NAME_IN_PENDING_CONTACT_REQUESTS": {
    const {oldName, newName} = action.payload;
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        pendingCR: state.userInfo.pendingCR.map((name) =>
          name === oldName ? newName : name
        ),
      },
    };
  }

  case "UPDATE_NAME_IN_CONTACT_REQUESTS": {
    const {oldName, newName} = action.payload;
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        contactRequests: state.userInfo.contactRequests.map((name) =>
          name === oldName ? newName : name
        ),
      },
    };
  }

  case "UPDATE_PENDING_CONTACT_REQUESTS":
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        pendingCR: action.payload.pendingContactRequests,
      },
    };

  case "UPDATE_ONLINE_FRIENDS":
    return {
      ...state,
      onlineFriends: action.payload.onlineFriends,
    };

  case "UPDATE_SEEN_BY_IN_CONVERSATION": {
    const {validatedUser} = action.payload;
    // Copy the messages array to avoid mutating the original state directly
    const updatedMessages = [...state.conversation.messages];
    // Iterate over the messages array in reverse order
    for (let i = updatedMessages.length - 1; i >= 0; i--) {
      if (!updatedMessages[i].seenBy.includes(validatedUser) && updatedMessages[i].receivers.includes(validatedUser)) {
        const usersWhoSeenMessage = [...updatedMessages[i].seenBy, validatedUser];
        const seenByAllReceivers = updatedMessages[i].receivers.length === usersWhoSeenMessage.length &&
        usersWhoSeenMessage.every((element) => updatedMessages[i].receivers.includes(element));

        // Update the seenBy field of the message
        updatedMessages[i] = {
          ...updatedMessages[i],
          seenBy: usersWhoSeenMessage,
          seenByAllReceivers: seenByAllReceivers
        };
      }
    }
    const updatedState = {
      ...state,
      conversation: {
        ...state.conversation,
        messages: updatedMessages,
      },
    };
    return updatedState;
  }

  case "UPDATE_USERNAME": {
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        username: action.payload.newName,
      },
    };
  }

  case "UPDATE_AVATAR": {
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        avatarImage: action.payload.avatarImage,
      },
    };
  }


  case "UPDATE_USER_INFO": {
    const {
      username,
      contactList,
      avatarImage,
      receivedContactRequests,
      conversations: updatedConversations,
      pendingContactRequests: updatedPendingContactRequests,
      onlineFriends,
    } = action.payload;
    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        username,
        avatarImage,
        contactList,
        contactRequests: receivedContactRequests,
        pendingCR: updatedPendingContactRequests,
      },
      conversations: updatedConversations,
      onlineFriends: onlineFriends
    };
  }

  default:
    return state; // Just return the state as it is without making changes
  }
};

export default loginReducer;
