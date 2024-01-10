// Import necessary hooks from Apollo Client
import {useMutation} from "@apollo/client";
import {
  CREATE_CONVERSATION,
  ADD_MESSAGE_TO_CONVERSATION,
  getDynamicConversationInfoQuery,
  MODIFY_CONVERSATION_NAME,
  ADD_CHAT_MEMBER,
  REMOVE_CHAT_MEMBER,
  ADD_ADMIN_TO_CONVERSATION,
  REMOVE_ADMIN_FROM_CONVERSATION,
  NOTIFY_TYPING_EVENT,
  DELETE_MESSAGE,
} from "./../../graphql/conversationClient";

import {useLazyQuery} from "@apollo/client";
import {useDispatch, useSelector} from "react-redux";
import {
  defineInterlocutors,
  updateMessages,
  defineConversationName,
  setSelectedConversationId,
  updateSeenByInConversation,
  defineConversationType,
  defineAdmins,
  defineParticipants,
  defineUsersTyping,
} from "./../../redux/actions";

// ADD_ADMIN_TO_CONVERSATION
export const useAddAdminToConversation = () => {
  const [addAdminMutation] = useMutation(ADD_ADMIN_TO_CONVERSATION);

  const addAdminToConversation = async (conversationId, newAdmins) => {
    try {
      const response = await addAdminMutation({
        variables: {
          conversationId,
          newAdmins,
        },
      });

      return response.data.addAdminToConversation.message;
    } catch (error) {
      console.error("Error adding admin to conversation:", error);
      throw error;
    }
  };

  return addAdminToConversation;
};

// ADD_CHAT_MEMBER
export const useAddChatMember = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.userInfo.username);
  const [addChatMemberMutation] = useMutation(ADD_CHAT_MEMBER);

  const addChatMember = async (conversationId, namesToAdd) => {
    try {
      const response = await addChatMemberMutation({
        variables: {
          conversationId,
          namesToAdd,
        },
      });
      const interlocutors = response.data.addChatMember.conversation.participants.filter((interlocutor)=>{
        return interlocutor !== username;
      });
      dispatch(defineInterlocutors(interlocutors));
      return response.data.addChatMember.message;
    } catch (error) {
      console.error("Error adding chat members:", error);
      throw error;
    }
  };

  return addChatMember;
};

// ADD_MESSAGE_TO_CONVERSATION
export const useAddMessageToConversation = () => {
  const [addMessageMutation] = useMutation(ADD_MESSAGE_TO_CONVERSATION);

  const addMessageToConversation = async (conversationId, message) => {
    try {
      await addMessageMutation({
        variables: {
          conversationId,
          content: message,
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error; // Re-throw the error if you want to handle it in the component
    }
  };

  return addMessageToConversation;
};

// CREATE_CONVERSATION
/**
 * Custom hook for creating a conversation using the CREATE_CONVERSATION mutation.
 * @return {Object} An object containing the createConversation function and mutation status data.
 */
export function useCreateConversation() {
  const [createConversation, {data, loading, error}] = useMutation(CREATE_CONVERSATION);

  return {
    createConversation,
    data,
    loading,
    error,
  };
}

// GET CONVERSATION INFO
// Constants for the dynamic query fields
const PARTICIPANTS_FIELD = "participants";
const ADMINS_FIELD = "admins";
// eslint-disable-next-line
const MESSAGES_FIELD = "messages {content deliveredTo receivers index seenBy sender isVisible deliveredToAllReceivers seenByAllReceivers}";
const NAME_FIELD = "name";
const IS_GROUPAL_FIELD = "isGroupalChat";
export const useGetConversationsInfo = (username) => {
  const dispatch = useDispatch();
  // getDynamicConversationInfoQuery is used to retrieve dynamically the information about the conversation
  const getParticipantsAndMessagesQuery = getDynamicConversationInfoQuery([
    PARTICIPANTS_FIELD,
    ADMINS_FIELD,
    MESSAGES_FIELD,
    NAME_FIELD,
    IS_GROUPAL_FIELD,
  ]);

  const [getConversationInfo] = useLazyQuery(getParticipantsAndMessagesQuery, {
    onCompleted: (data) => {
      const {participants, messages, name, isGroupalChat, admins} = data.getConversationInfo;
      const interlocutors = participants.filter((p) => p !== username);
      if (isGroupalChat) {
        dispatch(defineConversationName(name));
        dispatch(defineConversationType(true));
        dispatch(defineAdmins(admins));
      } else {
        const oneToOneChatName = interlocutors[0];
        dispatch(defineConversationName(oneToOneChatName));
        dispatch(defineConversationType(false));
        dispatch(defineAdmins([]));
      }
      dispatch(defineParticipants(participants));
      dispatch(defineInterlocutors(interlocutors));
      dispatch(updateMessages(messages));
      dispatch(defineUsersTyping([]));
      dispatch(updateSeenByInConversation(username));
    },
    onError: (error) => {
      console.error("Error fetching conversation info:", error);
    },
    fetchPolicy: "network-only",
  });

  // This function will be called with a conversationId when a conversation list item is clicked
  const fetchConversationInfo = (conversationId) => {
    getConversationInfo({
      variables: {conversationId},
    });
    dispatch(setSelectedConversationId(conversationId));
  };

  return fetchConversationInfo;
};

// MODIFY_CONVERSATION_NAME
export const useModifyConversationName = () => {
  const [modifyNameMutation] = useMutation(MODIFY_CONVERSATION_NAME);

  const modifyConversationName = async (conversationId, newName) => {
    try {
      const {data} = await modifyNameMutation({
        variables: {
          conversationId,
          newName,
        },
      });
      return data.modifyConversationName.message;
    } catch (error) {
      console.error("Error modifying conversation name:", error);
      throw error;
    }
  };

  return modifyConversationName;
};

// NOTIFY_TYPING_EVENT
export const useNotifyTypingEvent = () => {
  const [notifyTypingEventMutation] = useMutation(NOTIFY_TYPING_EVENT);

  const notifyTypingEvent = async (username, conversationId, participants) => {
    try {
      await notifyTypingEventMutation({
        variables: {
          username,
          conversationId,
          participants,
        },
      });
    } catch (error) {
      console.error("Error notifying typing event:", error);
      throw error;
    }
  };

  return notifyTypingEvent;
};

// REMOVE_ADMIN_FROM_CONVERSATION
export const useRemoveAdminFromConversation = () => {
  const dispatch = useDispatch();

  const [removeAdminMutation] = useMutation(REMOVE_ADMIN_FROM_CONVERSATION);

  const removeAdminFromConversation = async (conversationId, adminsToRemove) => {
    try {
      const response = await removeAdminMutation({
        variables: {
          conversationId,
          adminsToRemove,
        },
      });

      const admins = response.data.removeAdminFromConversation.admins;
      dispatch(defineAdmins(admins));
      // Update Redux state or perform other actions as needed
      return response.data.removeAdminFromConversation.message;
    } catch (error) {
      console.error("Error removing admin from conversation:", error);
      throw error;
    }
  };

  return removeAdminFromConversation;
};

// REMOVE_CHAT_MEMBER
export const useRemoveChatMember = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.userInfo.username);
  const [removeChatMemberMutation] = useMutation(REMOVE_CHAT_MEMBER);

  const removeChatMember = async (conversationId, nameToRemove) => {
    try {
      const response = await removeChatMemberMutation({
        variables: {
          conversationId,
          nameToRemove,
        },
      });
      const remainingParticipants = response.data.removeChatMember.conversation.participants.filter(
        (participant) => participant !== username);
      dispatch(defineInterlocutors(remainingParticipants));
      return response.data.removeChatMember.message;
    } catch (error) {
      console.error("Error removing chat member:", error);
      throw error;
    }
  };

  return removeChatMember;
};


export const useDeleteMessage = () => {
  const [deleteMessageMutation] = useMutation(DELETE_MESSAGE);

  const deleteMessage = async (conversationId, messageIndex) => {
    try {
      const {data} = await deleteMessageMutation({
        variables: {
          conversationId,
          messageIndex,
        },
      });
      return data.deleteMessage.message;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  return deleteMessage;
};

