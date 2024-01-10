const {gql} = require("apollo-server-express");

const subscriptionSchemas = gql`
  type UserStatus {
    username: String!
    status: String!
    contactList: [String]
  }

  type Query {
    dummy: String
  }

  type Message {
    sender: String!
    receivers: [String!]!
    content: String!
    index: Int!
    deliveredTo: [String!]
    seenBy: [String!]
    isVisible: Boolean!
    seenByAllReceivers: Boolean!
    deliveredToAllReceivers: Boolean!
  }

  type Mutation {
    changeFriendStatus(username: String!, status: String!): UserStatus
  }

  type ContactRequestNotification {
    sender: String!
    receiver: String!
  }

  type CancelRequestNotification {
    sender: String!
    receiver: String!
  }

  type AcceptedRequestNotification {
    sender: String!
    receiver: String!
  }

  type RejectedRequestNotification {
    sender: String!
    receiver: String!
  }

  type Conversation {
    conversationId: String!
    name: String!
    participants: [String]!
    date: String!
  }

  type MessageNotification {
    newMessage: Message!
    usersToUpdate: [String!]!
    date: String!
  }

  type MessageDeliveredNotification {
  validatedUser: String!
  idsAndParticipants: [ConversationParticipantInfo!]!
}

type ConversationParticipantInfo {
  conversationId: String!
  participants: [String!]!
}

type MessagesSeenNotification {
  conversationId: String!
  validatedUser: String!
  participants: [String!]!
}

type ChatNameChangedNotification {
  conversationId: String!
  newName: String!
  participants: [String!]!
}

type AdminModifiedNotification {
  admins: [String!]!
  conversationId: String!
  participants: [String!]!
}

type UserRemovedNotification {
  nameToRemove: String!
  conversationId: String!
  participants: [String!]!
}

type TypingEventNotification {
  username: String!
  conversationId: String!
  participants: [String!]!
}
type MessageDeletedNotification {
  conversationId: String!
  messageIndex: String!
}
type NameChangeInfo {
  oldName: String!
  newName: String!
}

type NameChangeContactListInfo {
  oldName: String!
  newName: String!
  contactList: [String!]
}

type NameChangeUserConversationsInfo {
  oldName: String!
  newName: String!
  conversations: [String!]
}

  type Subscription {
    acceptedRequestNotification(username: String!): AcceptedRequestNotification
    adminModifiedNotification(username: String!): AdminModifiedNotification
    cancelRequestNotification(username: String!): CancelRequestNotification
    chatNameChangedNotification(username: String!): ChatNameChangedNotification
    changeUserStatus(username: String!): UserStatus
    contactRequestNotification(username: String!): ContactRequestNotification
    messageDeletedNotification(conversationId: String!): MessageDeletedNotification
    messageDeliveredNotification(username: String!): MessageDeliveredNotification
    messagesSeenNotification(conversationId: String!, username: String!): MessagesSeenNotification
    newConversation(username: String!): Conversation
    notifyNewMessage(username: String!): MessageNotification
    rejectedRequestNotification(username: String!): RejectedRequestNotification
    typingEventNotification(username: String!): TypingEventNotification
    userRemovedNotification(username: String!): UserRemovedNotification
    nameChangeContactRequest(username: String!): NameChangeInfo
    nameChangePendingContactRequest(username: String!): NameChangeInfo
    nameChangeUserProfile(username: String!): NameChangeInfo
    nameChangeContactList(username: String!): NameChangeContactListInfo
    nameChangeUserConversations(conversationIds: [String!]!): NameChangeUserConversationsInfo
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = subscriptionSchemas;
