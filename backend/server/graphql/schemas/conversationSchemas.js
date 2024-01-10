const conversationSchemas = `#graphql
type AdminAdditionResponse {
  message: String!
  admins: [String]!
  conversationId: String!
  participants: [String]!
}

type Conversation {
  id: ID!
  name: String!
  participants: [String]!
  isGroupalChat: Boolean!
  date: String!          
  messages: [Message]!
}

type ConversationCreationResponse {
  message: String!
  conversationId: ID!
}

type ConversationInfo {
  name: String!
  participants: [String]!
  admins: [String]!
  isGroupalChat: Boolean!
  messages: [Message]!
}

type DeleteMessageResponse {
  message: String!
}

type DeliveredToResponse {
  message: String!
  deliveredTo: [String]!
}

type LastMessage {
  sender: String!
  content: String!
  receivers: [String]!
  deliveredTo: [String]!
  seenBy: [String]!
  index: Int!
  isVisible: Boolean!
}

type Message {
  sender: String!
  receivers: [String]!
  content: String!
  index: Int!
  deliveredTo: [String]!
  seenBy: [String]!
  conversationId: String!
  deliveredToAllReceivers: Boolean!
  seenByAllReceivers: Boolean!
  date: String!
}

type MessageAdditionResponse {
  message: String!
  newMessage: Message!
}

type MultipleConversationsResponse {
  message: String!
}

type MultipleConversationsUpdatedResponse {
  message: String!
}

type SeenByResponse {
  message: String!
  seenBy: [String]!
}

type Query {
  getConversationById(id: ID!): Conversation
  getConversationInfo(conversationId: ID!): ConversationInfo
  getDeliveredToArray(conversationId: ID!, messageIndex: Int!): DeliveredToResponse
  getLastMessage(conversationId: ID!): LastMessage
  getSeenByArray(conversationId: ID!, messageIndex: Int!): SeenByResponse
}

type AddChatMemberResponse {
  message: String!
  conversation: Conversation
}

type RemoveChatMemberResponse {
  message: String!
  conversation: Conversation
}

type AdminRemovalResponse {
  message: String!
  admins: [String]!
  conversationId: String!
  participants: [String]!
}

type RemoveConversationResponse {
  success: Boolean!
  message: String!
}

type Mutation {
  addAdminToConversation(conversationId: ID!, newAdmins: [String]!): AdminAdditionResponse!
  addChatMember(conversationId: ID!, namesToAdd: [String!]!): AddChatMemberResponse!
  addMessageToConversation(conversationId: ID!, content: String!): MessageAdditionResponse!
  addNameToDeliveredTo(conversationId: ID!, messageIndex: Int!, username: String!): DeliveredToResponse!
  addNameToSeenBy(conversationId: ID!, messageIndex: Int!, username: String!): SeenByResponse!
  createConversation(name: String!, participants: [String]!, isGroupalChat: Boolean!): ConversationCreationResponse! 
  deleteMessage(conversationId: String!, messageIndex: String!): DeleteMessageResponse!
  modifyConversationName(conversationId: String!, newName: String!): String!
  notifyChatsOfUserConnection(username: String!, conversationIds: [String]!): MultipleConversationsUpdatedResponse!
  notifyMessageIsDelivered(conversationIds: [ID]!, username: String!): MultipleConversationsResponse!
  removeChatMember(conversationId: ID!, nameToRemove: String!): RemoveChatMemberResponse!
  removeAdminFromConversation(conversationId: ID!, adminsToRemove: [String]!): AdminRemovalResponse!
  removeConversation(conversationId: String!): RemoveConversationResponse
  notifyTypingEvent(username: String!, conversationId: ID!, participants: [String]!): String
}
`;

module.exports = conversationSchemas;
