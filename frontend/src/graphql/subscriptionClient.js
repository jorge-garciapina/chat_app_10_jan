import gql from "graphql-tag";

export const ACCEPTED_REQUEST_NOTIFICATION = gql`
  subscription AcceptedRequestNotification($username: String!) {
    acceptedRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;
export const ADMIN_MODIFIED_NOTIFICATION = gql`
  subscription AdminModifiedNotification($username: String!) {
    adminModifiedNotification(username: $username) {
      admins
      conversationId
      participants
    }
  }
`;

export const CANCEL_REQUEST_NOTIFICATION = gql`
  subscription CancelRequestNotification($username: String!) {
    cancelRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;

export const CHANGE_TO_ONLINE = gql`
  subscription ChangeUserToOnline($username: String!) {
    changeUserToOnline(username: $username) {
      username
      status
    }
  }
`;

export const CHANGE_USER_STATUS = gql`
  subscription Subscription($username: String!) {
    changeUserStatus(username: $username) {
      status
      username
    }
  }
`;

export const CHAT_NAME_CHANGED_NOTIFICATION = gql`
  subscription ChatNameChangedNotification($username: String!) {
    chatNameChangedNotification(username: $username) {
      conversationId
      newName
      participants
    }
  }
`;

export const CONTACT_REQUEST_NOTIFICATION = gql`
  subscription ContactRequestNotification($username: String!) {
    contactRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;

export const MESSAGE_DELETED_NOTIFICATION = gql`
  subscription MessageDeletedNotification($conversationId: String!) {
    messageDeletedNotification(conversationId: $conversationId) {
      conversationId
      messageIndex
    }
  }
`;

export const MESSAGE_DELIVERED_NOTIFICATION = gql`
  subscription MessageDeliveredNotification($username: String!) {
    messageDeliveredNotification(username: $username) {
      validatedUser
      idsAndParticipants {
        conversationId
        participants
      }
    }
  }
`;

export const MESSAGES_SEEN_NOTIFICATION = gql`
  subscription MessagesSeenNotification($username: String!, $conversationId: String!) {
    messagesSeenNotification(username: $username, conversationId: $conversationId) {
      conversationId
      validatedUser
      participants
    }
  }
`;

export const NAME_CHANGE_USER_CONVERSATIONS_SUBSCRIPTION = gql`
  subscription NameChangeUserConversations($conversationIds: [String!]!) {
    nameChangeUserConversations(conversationIds: $conversationIds) {
      oldName
      newName
      conversations
    }
  }
`;

export const NAME_CHANGE_CONTACT_LIST_SUBSCRIPTION = gql`
  subscription NameChangeContactList($username: String!) {
    nameChangeContactList(username: $username) {
      oldName
      newName
      contactList
    }
  }
`;

export const NAME_CHANGE_CONTACT_REQUEST_SUBSCRIPTION = gql`
  subscription NameChangeContactRequest($username: String!) {
    nameChangeContactRequest(username: $username) {
      oldName
      newName
    }
  }
`;

export const NAME_CHANGE_PENDING_CONTACT_REQUEST_SUBSCRIPTION = gql`
  subscription NameChangePendingContactRequest($username: String!) {
    nameChangePendingContactRequest(username: $username) {
      oldName
      newName
    }
  }
`;

export const NAME_CHANGE_USER_PROFILE_SUBSCRIPTION = gql`
  subscription NameChangeUserProfile($username: String!) {
    nameChangeUserProfile(username: $username) {
      oldName
      newName
    }
  }
`;


export const NEW_CONVERSATION = gql`
  subscription NewConversation($username: String!) {
    newConversation(username: $username) {
      conversationId
      name
      date
      isGroupalChat
      participants
      lastMessage {
        content
        sender
      }
    }
  }
`;

export const NOTIFY_NEW_MESSAGE = gql`
  subscription NotifyNewMessage($username: String!) {
    notifyNewMessage(username: $username) {
      newMessage {
        content
        deliveredTo
        index
        receivers
        seenBy
        sender
        isVisible
        conversationId
        seenByAllReceivers
        deliveredToAllReceivers
      }
      usersToUpdate,
      date,
    }
  }
`;

export const REJECTED_REQUEST_NOTIFICATION = gql`
  subscription RejectedRequestNotification($username: String!) {
    rejectedRequestNotification(username: $username) {
      sender
      receiver
    }
  }
`;

export const USER_REMOVED_NOTIFICATION = gql`
  subscription UserRemovedNotification($username: String!) {
    userRemovedNotification(username: $username) {
      nameToRemove
      conversationId
      participants
    }
  }
`;

export const TYPING_EVENT_NOTIFICATION = gql`
  subscription TypingEventNotification($username: String!) {
    typingEventNotification(username: $username) {
      username
      conversationId
      participants
    }
  }
`;
