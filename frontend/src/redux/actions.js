export const addContactRequest = (newContactRequest) => ({
  type: "ADD_CONTACT_REQUEST",
  payload: {newContactRequest},
});

export const addNameToUsersTyping = (username) => ({
  type: "ADD_NAME_TO_USER_TYPING",
  payload: {username},
});

export const addNewConversation = (newConversation) => ({
  type: "ADD_NEW_CONVERSATION",
  payload: {newConversation},
});

export const addToContactList = (newContact) => ({
  type: "ADD_TO_CONTACT_LIST",
  payload: {newContact},
});

export const appendMessage = (message) => ({
  type: "APPEND_MESSAGE",
  payload: {message},
});


export const authUser = (isAuthenticated) => ({
  type: "AUTHENTICATE_USER",
  payload: isAuthenticated,
});

export const cancelContactRequest = (username) => ({
  type: "CANCEL_CONTACT_REQUEST",
  payload: {username},
});

export const defineAdmins = (admins) => ({
  type: "DEFINE_ADMINS",
  payload: {admins},
});

export const defineUsersTyping = (usersTyping) => ({
  type: "DEFINE_USERS_TYPING",
  payload: {usersTyping},
});

export const defineConversationName = (name) => ({
  type: "DEFINE_CONVERSATION_NAME",
  payload: {name},
});

export const defineConversationType = (isGroupalChat) => ({
  type: "DEFINE_CONVERSATION_TYPE",
  payload: {isGroupalChat},
});


export const defineInterlocutors = (interlocutors) => ({
  type: "DEFINE_INTERLOCUTOR",
  payload: {interlocutors},
});

export const defineNameInConversationsArray = (conversationId, name) => ({
  type: "DEFINE_NAME_IN_CONVERSATIONS_ARRAY",
  payload: {conversationId, name},
});

export const defineParticipants = (participants) => ({
  type: "DEFINE_PARTICIPANT",
  payload: {participants},
});

export const defineParticipantsInConversationsArray = (conversationId, participants) => ({
  type: "DEFINE_PARTICIPANTS_IN_CONVERSATIONS_ARRAY",
  payload: {conversationId, participants},
});

export const deleteNameFromUsersTyping = (username) => ({
  type: "DELETE_NAME_FROM_USER_TYPING",
  payload: {username},
});

export const interlocutorIsOnline = (interlocutor) => ({
  type: "INTERLOCUTOR_IS_ONLINE",
  payload: {interlocutor},
});

export const loginAction = (username) => ({
  type: "LOGIN",
  payload: {username},
});

export const logoutAction = (username) => ({
  type: "LOGOUT",
  payload: {username},
});

export const modifyConversationDateInArray = (conversationId, date) => ({
  type: "MODIFY_CONVERSATION_DATE",
  payload: {conversationId, date},
});

export const modifyConversationNameInArray = (newName, conversationId) => ({
  type: "MODIFY_CONVERSATION_NAME",
  payload: {newName, conversationId},
});

export const removeContactRequest = (contactRequestToRemove) => ({
  type: "REMOVE_CONTACT_REQUEST",
  payload: {contactRequestToRemove},
});

export const modifyMessageVisibility = (conversationId, messageIndex) => ({
  type: "MODIFY_MESSAGE_VISIBILITY",
  payload: {conversationId, messageIndex},
});

export const removeConversation = (conversationId) => ({
  type: "REMOVE_CONVERSATION",
  payload: {conversationId},
});


export const removePendingContactRequest = (pendingContactRequestToRemove) => ({
  type: "REMOVE_PENDING_CONTACT_REQUEST",
  payload: {pendingContactRequestToRemove},
});

export const setSelectedConversationId = (conversationId) => ({
  type: "SET_SELECTED_CONVERSATION_ID",
  payload: {conversationId},
});

export const setToInitialState = () => ({
  type: "SET_TO_INITIAL_STATE",
});

export const updateConversations = (conversations) => ({
  type: "UPDATE_CONVERSATIONS",
  payload: {conversations},
});

export const updateDeliveredToInConversation = (validatedUser) => ({
  type: "UPDATE_DELIVERED_TO_IN_CONVERSATION",
  payload: {validatedUser},
});

export const updateLastMessage = (conversationId, lastMessage) => ({
  type: "UPDATE_LAST_MESSAGE",
  payload: {conversationId, lastMessage},
});

export const updateMessages = (messages) => ({
  type: "UPDATE_MESSAGES",
  payload: {messages},
});

// Action to update a name in online friends
export const updateNameInOnlineFriends = (oldName, newName) => ({
  type: "UPDATE_NAME_IN_ONLINE_FRIENDS",
  payload: {oldName, newName},
});

// Action to update a name in the user's contact list
export const updateNameInContactList = (oldName, newName) => ({
  type: "UPDATE_NAME_IN_CONTACT_LIST",
  payload: {oldName, newName},
});

// Action to update a name in pending contact requests
export const updateNameInPendingContactRequests = (oldName, newName) => ({
  type: "UPDATE_NAME_IN_PENDING_CONTACT_REQUESTS",
  payload: {oldName, newName},
});

// Action to update a name in contact requests
export const updateNameInContactRequests = (oldName, newName) => ({
  type: "UPDATE_NAME_IN_CONTACT_REQUESTS",
  payload: {oldName, newName},
});

export const updateUsernameInConversation = (oldName, newName) => ({
  type: "UPDATE_USERNAME_IN_CONVERSATION",
  payload: {oldName, newName},
});

export const updateUsernameInConversationsArray = (oldName, newName, conversations) => ({
  type: "UPDATE_USERNAME_IN_CONVERSATIONS_ARRAY",
  payload: {oldName, newName, conversations},
});


export const updatePendingContactRequests = (pendingContactRequests) => ({
  type: "UPDATE_PENDING_CONTACT_REQUESTS",
  payload: {pendingContactRequests},
});

export const updateSeenByInConversation = (validatedUser) => ({
  type: "UPDATE_SEEN_BY_IN_CONVERSATION",
  payload: {validatedUser},
});

export const updateOnlineFriends = (onlineFriends) => ({
  type: "UPDATE_ONLINE_FRIENDS",
  payload: {onlineFriends},
});

export const updateUsername = (newName) => ({
  type: "UPDATE_USERNAME",
  payload: {newName},
});

export const updateAvatarImage = (avatarImage) => ({
  type: "UPDATE_AVATAR",
  payload: {avatarImage},
});

export const updateUserInfo = (
  username,
  avatarImage,
  contactList,
  receivedContactRequests,
  conversations,
  pendingContactRequests,
  onlineFriends,
) => ({
  type: "UPDATE_USER_INFO",
  payload: {
    username,
    avatarImage,
    contactList,
    receivedContactRequests,
    conversations,
    pendingContactRequests,
    onlineFriends,
  },
});
