// Subscriptions.js
import {useRef, useEffect} from "react";
import {useSubscription} from "@apollo/client";
import {useSelector, useDispatch} from "react-redux";
import {
  loginAction,
  logoutAction,
  addNewConversation,
  addContactRequest,
  removeContactRequest,
  appendMessage,
  updateLastMessage,
  addToContactList,
  removePendingContactRequest,
  updateDeliveredToInConversation,
  updateSeenByInConversation,
  defineConversationName,
  modifyConversationNameInArray,
  defineParticipants,
  defineParticipantsInConversationsArray,
  defineNameInConversationsArray,
  defineInterlocutors,
  defineAdmins,
  addNameToUsersTyping,
  deleteNameFromUsersTyping,
  modifyMessageVisibility,
  modifyConversationDateInArray,
  updateNameInPendingContactRequests,
  updateNameInContactRequests,
  updateUsername,
  updateNameInOnlineFriends,
  updateNameInContactList,
  updateUsernameInConversationsArray,
  updateUsernameInConversation,
} from "./../../redux/actions";
import {
  CHANGE_USER_STATUS,
  NEW_CONVERSATION,
  CONTACT_REQUEST_NOTIFICATION,
  CANCEL_REQUEST_NOTIFICATION,
  NOTIFY_NEW_MESSAGE,
  ACCEPTED_REQUEST_NOTIFICATION,
  REJECTED_REQUEST_NOTIFICATION,
  MESSAGE_DELIVERED_NOTIFICATION,
  MESSAGES_SEEN_NOTIFICATION,
  CHAT_NAME_CHANGED_NOTIFICATION,
  USER_REMOVED_NOTIFICATION,
  ADMIN_MODIFIED_NOTIFICATION,
  TYPING_EVENT_NOTIFICATION,
  MESSAGE_DELETED_NOTIFICATION,
  NAME_CHANGE_CONTACT_REQUEST_SUBSCRIPTION,
  NAME_CHANGE_PENDING_CONTACT_REQUEST_SUBSCRIPTION,
  NAME_CHANGE_USER_PROFILE_SUBSCRIPTION,
  NAME_CHANGE_CONTACT_LIST_SUBSCRIPTION,
  NAME_CHANGE_USER_CONVERSATIONS_SUBSCRIPTION,
} from "./../../graphql/subscriptionClient";

/**
 * Subscriptions component for managing GraphQL subscriptions.
 * This component handles various subscription events related to user status,
 * conversations, messages, and contact requests.
 */
function Subscriptions() {
  // The code calls the state. It's here, at the top to share the state among the different subscriptions
  const username = useSelector((state) => state.userInfo.username);
  const currentConversationId = useSelector(
    (state) => state.conversation.conversationId
  );
  const conversations = useSelector((state) => state.conversations);
  const conversationIds = conversations.map((conversation) => conversation.conversationId);

  const dispatch = useDispatch();

  // ACCEPTED_REQUEST_NOTIFICATION subscription
  useSubscription(ACCEPTED_REQUEST_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const acceptedRequest = data.data.acceptedRequestNotification;
      dispatch(addToContactList(acceptedRequest.receiver));
      dispatch(removePendingContactRequest(acceptedRequest.receiver));
    },
  });

  // CANCEL_REQUEST_NOTIFICATION subscription
  useSubscription(CANCEL_REQUEST_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const cancelRequest = data.data.cancelRequestNotification;
      dispatch(removeContactRequest(cancelRequest.sender));
    },
  });

  // CHANGE_USER_STATUS subscription
  useSubscription(CHANGE_USER_STATUS, {
    variables: {username},
    onData: ({data}) => {
      const {username, status} = data.data.changeUserStatus;
      if (status === "ONLINE") {
        dispatch(loginAction(username));
      } else if (status === "OFFLINE") {
        dispatch(logoutAction(username));
      }
    },
  });

  // CHAT_NAME_CHANGED_NOTIFICATION
  useSubscription(CHAT_NAME_CHANGED_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const {newName, conversationId} = data.data.chatNameChangedNotification;

      if (currentConversationId ===conversationId) {
        dispatch(defineConversationName(newName));
      }
      // Dispatch the action to modify the conversation name in the array
      dispatch(modifyConversationNameInArray(newName, conversationId));
    },
  });

  // CONTACT_REQUEST_NOTIFICATION subscription
  useSubscription(CONTACT_REQUEST_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const contactRequest = data.data.contactRequestNotification;
      dispatch(addContactRequest(contactRequest.sender));
    },
  });

  // MESSAGE_DELETED_NOTIFICATION
  useSubscription(MESSAGE_DELETED_NOTIFICATION, {
    variables: {conversationId: currentConversationId},
    onData: ({data}) => {
      const notification = data.data.messageDeletedNotification;
      const {conversationId, messageIndex} = notification;

      dispatch(modifyMessageVisibility(conversationId, messageIndex));
    },
  });

  // MESSAGE_DELIVERED_NOTIFICATION
  useSubscription(MESSAGE_DELIVERED_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const notification = data.data.messageDeliveredNotification;
      const idsAndParticipants = notification.idsAndParticipants;
      const validatedUser = notification.validatedUser;

      for (const conversation of idsAndParticipants) {
        if (conversation.conversationId === currentConversationId) {
          dispatch(updateDeliveredToInConversation(validatedUser));
          break; // Break the loop once a match is found
        }
      }
    },
  });

  // MESSAGES_SEEN_NOTIFICATION
  useSubscription(MESSAGES_SEEN_NOTIFICATION, {
    variables: {username, conversationId: currentConversationId},
    onData: ({data}) => {
      const notification = data.data.messagesSeenNotification;
      const userWhoSeeTheMessage = notification.validatedUser;

      if (notification.conversationId === currentConversationId) {
        dispatch(updateSeenByInConversation(userWhoSeeTheMessage));
      }
    },
  });

  useSubscription(NAME_CHANGE_USER_CONVERSATIONS_SUBSCRIPTION, {
    variables: {conversationIds},
    onData: ({data}) => {
      const {oldName, newName, conversations} = data.data.nameChangeUserConversations;
      dispatch(updateUsernameInConversationsArray(oldName, newName, conversations));
      conversations.map((conversation) => {
        if (conversation === currentConversationId) {
          dispatch(updateUsernameInConversation(oldName, newName));
        }
      });
    },
  });

  useSubscription(NAME_CHANGE_CONTACT_LIST_SUBSCRIPTION, {
    variables: {username},
    onData: ({data}) => {
      const {oldName, newName} = data.data.nameChangeContactList;
      dispatch(updateNameInOnlineFriends(oldName, newName));
      dispatch(updateNameInContactList(oldName, newName));
    },
  });

  useSubscription(NAME_CHANGE_CONTACT_REQUEST_SUBSCRIPTION, {
    variables: {username},
    onData: ({data}) => {
      const {oldName, newName} = data.data.nameChangeContactRequest;
      dispatch(updateNameInPendingContactRequests(oldName, newName));
    },
  });


  useSubscription(NAME_CHANGE_PENDING_CONTACT_REQUEST_SUBSCRIPTION, {
    variables: {username},
    onData: ({data}) => {
      const {oldName, newName} = data.data.nameChangePendingContactRequest;
      dispatch(updateNameInContactRequests(oldName, newName));
    },
  });

  useSubscription(NAME_CHANGE_USER_PROFILE_SUBSCRIPTION, {
    variables: {username},
    onData: ({data}) => {
      const {newName,} = data.data.nameChangeUserProfile;
      dispatch(updateUsername(newName));
    },
  });
  // NEW_CONVERSATION
  useSubscription(NEW_CONVERSATION, {
    variables: {username},
    onData: ({data}) => {
      const newConversation = data.data.newConversation;
      const {conversationId, participants, name} = newConversation;

      // Check if the conversationId is not already present in the conversations array
      const isConversationNew = !conversations.some(
        (conversation) => conversation.conversationId === newConversation.conversationId);

      // CASE 1: this is the case in which the user is added to a conversation for the first time
      if (isConversationNew) {
        // This if/else is for naming the conversation in the state.conversations entry of the redux state
        // I do this because the one to one conversations are named "oneToOne".
        if (newConversation.isGroupalChat) {
          dispatch(addNewConversation(newConversation));
        } else {
          // In this part the name "oneToOne" is replaced for the name of the interlocutor.
          // (the name will be replaced only in the Redux state, not in the database)
          const {participants} = newConversation;
          const interlocutor = participants.find((user) => user !== username);
          if (interlocutor) {
            newConversation.name = interlocutor;
            dispatch(addNewConversation(newConversation));
          }
        }
      } else {
        // CASE 2: This will be the case to notify other participants of the conversation that an user
        //         has been added to the conversation
        // In case any of the user has this conversation open:
        if (currentConversationId === conversationId) {
          const interlocutors = participants.filter((participant)=>{
            return participant !== username;
          });
          dispatch(defineConversationName(name));
          dispatch(defineParticipants(participants));
          dispatch(defineInterlocutors(interlocutors));
        }
        // To update the state.conversation.*current covnersation ID* in the redux state
        dispatch(defineParticipantsInConversationsArray(conversationId, participants));
        dispatch(defineNameInConversationsArray(conversationId, name));
      }
    },
  });


  // NOTIFY_NEW_MESSAGE
  useSubscription(NOTIFY_NEW_MESSAGE, {
    variables: {username},
    onData: ({data}) => {
      if (data.data && data.data.notifyNewMessage) {
        const {
          conversationId,
          content,
          deliveredTo,
          receivers,
          index,
          seenBy,
          sender,
          isVisible,
          seenByAllReceivers,
          deliveredToAllReceivers,
        } = data.data.notifyNewMessage.newMessage;

        const date = data.data.notifyNewMessage.date;

        // Dispatch the action to modify the conversation name in the array
        dispatch(modifyConversationDateInArray(conversationId, date));

        // Check if the conversationId received in the subscription equals the conversationId in the Redux state
        if (currentConversationId && conversationId === currentConversationId) {
          // Dispatch the appendMessage action to update the conversation
          dispatch(
            appendMessage({
              __typename: "Message",
              content,
              deliveredTo,
              receivers,
              index,
              seenBy,
              sender,
              isVisible,
              seenByAllReceivers,
              deliveredToAllReceivers,
            })
          );
        }
        // Prepare the lastMessage object based on the new message data
        const lastMessage = {
          __typename: "LastMessage",
          content,
          sender,
        };

        // Dispatch the action to update the last message of the conversation
        dispatch(updateLastMessage(conversationId, lastMessage));
      }
    },
  });

  // REJECTED_REQUEST_NOTIFICATION subscription
  useSubscription(REJECTED_REQUEST_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const rejectedRequest = data.data.rejectedRequestNotification;
      dispatch(removePendingContactRequest(rejectedRequest.receiver));
    },
  });

  useSubscription(USER_REMOVED_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      const {conversationId, participants} = data.data.userRemovedNotification;
      if (currentConversationId === conversationId) {
        const interlocutors = participants.filter((participant)=>{
          return participant !== username;
        });
        dispatch(defineParticipants(participants));
        dispatch(defineInterlocutors(interlocutors));
      }

      dispatch(defineParticipantsInConversationsArray(conversationId, participants));
    },
  });

  useSubscription(ADMIN_MODIFIED_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      if (data) {
        const {admins, conversationId} = data.data.adminModifiedNotification;
        if (currentConversationId === conversationId) {
          dispatch(defineAdmins(admins));
        }
      }
    },
  });

  const typingTimeoutsRef = useRef({});

  useSubscription(TYPING_EVENT_NOTIFICATION, {
    variables: {username},
    onData: ({data}) => {
      if (data) {
        const {username: typingUsername, conversationId} = data.data.typingEventNotification;
        if (currentConversationId === conversationId) {
          dispatch(addNameToUsersTyping(typingUsername));

          // Clear any existing timeout for this user
          if (typingTimeoutsRef.current[typingUsername]) {
            clearTimeout(typingTimeoutsRef.current[typingUsername]);
          }

          // Set a new timeout for this user. The code will show the "*username* is typing" half a second
          typingTimeoutsRef.current[typingUsername] = setTimeout(() => {
            dispatch(deleteNameFromUsersTyping(typingUsername));
            delete typingTimeoutsRef.current[typingUsername];
          }, 500);
        }
      }
    },
  });

  // Clear all timeouts when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  // Note:
  // This component does not render anything
  return null;
}

export default Subscriptions;
