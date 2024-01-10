import {useQuery} from "@apollo/client";
import {useDispatch} from "react-redux";
import {useLazyQuery} from "@apollo/client";
import {updateUserInfo} from "./../../redux/actions";

import {
  INFO_QUERY,
  SEARCH_USERS,
  SEND_CONTACT_REQUEST,
  CANCEL_CONTACT_REQUEST,
  ACCEPT_CONTACT_REQUEST_MUTATION,
  REJECT_CONTACT_REQUEST_MUTATION,
  GET_USER_STATUS_QUERY,
  DELETE_CHAT_MUTATION,
  UPDATE_USERNAME_MUTATION,
  CHANGE_AVATAR_IMAGE_MUTATION,
} from "./../../graphql/userQueries";

import {useMutation} from "@apollo/client";
import {
  cancelContactRequest,
  updatePendingContactRequests,
  removeContactRequest,
  addToContactList,
  interlocutorIsOnline,
  defineConversationName,
  defineConversationType,
  setSelectedConversationId,
  defineInterlocutors,
  defineParticipants,
  updateMessages,
  defineAdmins,
  removeConversation,
  updateOnlineFriends,
  updateAvatarImage,
} from "./../../redux/actions";

export const useChangeAvatarImage = () => {
  const dispatch = useDispatch();
  const [changeAvatarImageMutation] = useMutation(CHANGE_AVATAR_IMAGE_MUTATION);

  const handleChangeAvatarImage = async (avatarImage) => {
    return changeAvatarImageMutation({
      variables: {avatarImage},
    }).then((data) => {
      const {avatarImage} = data.data.changeAvatarImage;

      dispatch(updateAvatarImage(avatarImage));
    }).catch((error) => {
      console.error("Error updating avatar image:", error);
    });
  };

  return handleChangeAvatarImage;
};

export const useUpdateUsername = () => {
  const [updateUsernameMutation] = useMutation(UPDATE_USERNAME_MUTATION);

  const handleUpdateUsername = async (newName) => {
    return updateUsernameMutation({
      variables: {newName},
    }).then(() => {
      // in case i need to do something
    }).catch((error) => {
      // Handle any errors here
      console.error("Error updating username:", error);
      // Optionally dispatch error handling actions or show error messages
    });
  };

  return handleUpdateUsername;
};
// ACCEPT_CONTACT_REQUEST_MUTATION
export const useAcceptContactRequest = () => {
  const dispatch = useDispatch();
  const [acceptContactRequestMutation] = useMutation(
    ACCEPT_CONTACT_REQUEST_MUTATION
  );

  const handleAcceptRequest = async (username) => {
    return acceptContactRequestMutation({
      variables: {senderUsername: username},
    }).then((data) => {
      const {onlineFriends} = data.data.acceptContactRequest;

      dispatch(updateOnlineFriends(onlineFriends));
      dispatch(removeContactRequest(username));
      dispatch(addToContactList(username));
    });
  };

  return handleAcceptRequest;
};

// CANCEL_CONTACT_REQUEST
export const useCancelContactRequest = (username) => {
  const dispatch = useDispatch();
  const [cancelRequest, {loading: cancelling}] = useMutation(
    CANCEL_CONTACT_REQUEST,
    {
      onCompleted: () => {
        dispatch(cancelContactRequest(username));
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    cancelRequest: (receiverUsername) =>
      cancelRequest({variables: {receiverUsername}}),
    cancelling,
  };
};

export const useDeleteChat = () => {
  const [deleteChatMutation] = useMutation(DELETE_CHAT_MUTATION);
  const dispatch = useDispatch();


  const handleDeleteChat = async (conversationId, username) => {
    const response = await deleteChatMutation({
      variables: {conversationId, username}
    });

    dispatch(defineConversationName(null));
    dispatch(defineConversationType(null));
    dispatch(setSelectedConversationId(null));
    dispatch(defineInterlocutors([]));
    dispatch(defineParticipants([]));
    dispatch(updateMessages([]));
    dispatch(defineAdmins([]));
    dispatch(removeConversation(conversationId));

    return response;
  };

  return handleDeleteChat;
};

// GET_USER_STATUS_QUERY
export const useUserStatus = (interlocutors, username) => {
  const dispatch = useDispatch();

  useQuery(GET_USER_STATUS_QUERY, {
    skip: !interlocutors || interlocutors.length === 0,
    variables: {usernames: interlocutors},
    onCompleted: (data) => {
      if (data.getUserStatuses) {
        data.getUserStatuses.forEach((statusObj) => {
          if (statusObj.onlineStatus && statusObj.username !== username) {
            dispatch(interlocutorIsOnline(statusObj.username));
          }
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching user statuses:", error);
    },
  });
};

// INFO_QUERY
export const useUserInfo = () => {
  const dispatch = useDispatch();

  const {loading, error} = useQuery(INFO_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      // 1- INFO_QUERY is used to fetch user information from the server
      const username = data?.userInfo?.username;
      const contactList = data?.userInfo?.contactList;
      const avatarImage = data?.userInfo?.avatar;
      const conversations = data?.userInfo?.conversations || [];
      const onlineFriends = data?.userInfo?.onlineFriends || [];
      const receivedContactRequests = data.userInfo.receivedContactRequests.map(
        (request) => request.sender
      );
      const pendingContactRequests = data.userInfo.pendingContactRequests.map(
        (request) => request.receiver
      );

      // /////////////////////////////////////////////////////////////////////////////
      // //////////////////////////////------START------//////////////////////////////
      // To understand this operations it is important to consider:
      // - The one to one chats are stored in the database with the name oneToOneConversation
      // - The groupal chats are stored in the database with the named assigned by the user
      // - The folowing operations change the name from oneToOneConversation to the name of the interlocutor
      const {oneToOneChats} = conversations.reduce(
        (acc, chat) => {
          if (!chat.isGroupalChat) {
            acc.oneToOneChats.push(chat);
          }
          return acc;
        },
        {oneToOneChats: []}
      );

      oneToOneChats.forEach((chat) => {
        const interlocutor = chat.participants.filter((participant) => {
          return participant !== username;
        })[0];
        // THIS CHANGES THE NAME IN THE conversations ARRAY, NO NEED OF MORE OPERATIONS
        chat.name = interlocutor;
      });
      // AFTER THIS OPERATIONS THE NAME OF THE ONE TO ONE CONVERSATIONS HAVE BEEN MODIFIED

      // ///////////////////////////------END------/////////////////////////////////
      // ///////////////////////////////////////////////////////////////////////////

      // To sort conversation by date (the newest will be displayed first):
      conversations.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 2- updateUserInfo is dispatched to update the user information in the Redux state
      dispatch(
        updateUserInfo(
          username,
          avatarImage,
          contactList,
          receivedContactRequests,
          conversations,
          pendingContactRequests,
          onlineFriends,
        )
      );
    },
    onError: (error) => {
      console.error("Error in fetching user info:", error);
    },
  });

  return {loading, error};
};

// REJECT_CONTACT_REQUEST_MUTATION
export const useRejectContactRequest = () => {
  const dispatch = useDispatch();
  const [rejectContactRequestMutation] = useMutation(
    REJECT_CONTACT_REQUEST_MUTATION
  );

  const handleRejectRequest = (username) => {
    return rejectContactRequestMutation({
      variables: {senderUsername: username},
    }).then(() => {
      dispatch(removeContactRequest(username));
    });
  };

  return handleRejectRequest;
};

// SEARCH_USERS
export const useUserSearch = () => {
  const [executeSearch, {data, loading, error}] = useLazyQuery(SEARCH_USERS);

  return {
    executeSearch,
    searchData: data,
    searchLoading: loading,
    searchError: error,
  };
};

// SEND_CONTACT_REQUEST
export const useSendContactRequest = (pendingContactRequests, username) => {
  const dispatch = useDispatch();
  const [sendContactRequest, {loading: sending}] = useMutation(
    SEND_CONTACT_REQUEST,
    {
      onCompleted: () => {
        dispatch(
          updatePendingContactRequests([...pendingContactRequests, username])
        );
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return {
    sendContactRequest: (receiverUsername) =>
      sendContactRequest({variables: {receiverUsername}}),
    sending,
  };
};
