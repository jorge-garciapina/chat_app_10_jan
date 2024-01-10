import gql from "graphql-tag";

export const ADD_ADMIN_TO_CONVERSATION = gql`
  mutation AddAdminToConversation($conversationId: ID!, $newAdmins: [String!]!) {
    addAdminToConversation(conversationId: $conversationId, newAdmins: $newAdmins) {
      message
      admins
      conversationId
    }
  }
`;

export const NOTIFY_TYPING_EVENT = gql`
  mutation NotifyTypingEvent($username: String!, $conversationId: ID!, $participants: [String]!) {
    notifyTypingEvent(username: $username, conversationId: $conversationId, participants: $participants)
  }
`;

export const REMOVE_ADMIN_FROM_CONVERSATION = gql`
  mutation RemoveAdminFromConversation($conversationId: ID!, $adminsToRemove: [String!]!) {
    removeAdminFromConversation(conversationId: $conversationId, adminsToRemove: $adminsToRemove) {
      message
      admins
      conversationId
    }
  }
`;

export const ADD_CHAT_MEMBER = gql`
  mutation AddChatMember($conversationId: ID!, $namesToAdd: [String!]!) {
    addChatMember(conversationId: $conversationId, namesToAdd: $namesToAdd) {
      conversation {
        participants
      }
    }
  }
`;

export const ADD_MESSAGE_TO_CONVERSATION = gql`
  mutation Mutation($conversationId: ID!, $content: String!) {
    addMessageToConversation(
      conversationId: $conversationId
      content: $content
    ) {
      message
      newMessage {
        conversationId
        date
    }
    }
  }
`;

export const ADD_NAME_TO_SEEN_BY = gql`
  mutation AddNameToSeenBy(
    $conversationId: ID!
    $messageIndex: Int!
    $username: String!
  ) {
    addNameToSeenBy(
      conversationId: $conversationId
      messageIndex: $messageIndex
      username: $username
    ) {
      message
      seenBy
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation(
    $name: String!
    $participants: [String]!
    $isGroupalChat: Boolean!
  ) {
    createConversation(
      name: $name
      participants: $participants
      isGroupalChat: $isGroupalChat
    ) {
      message
      conversationId
    }
  }
`;

export const GET_CONVERSATION_BY_ID = gql`
  query GetConversationById($id: ID!) {
    getConversationById(id: $id) {
      id
      participants
      messages {
        sender
        receivers
        content
        index
        deliveredTo
        seenBy
      }
    }
  }
`;

export const GET_DELIVERED_TO_ARRAY = gql`
  query GetDeliveredToArray($conversationId: ID!, $messageIndex: Int!) {
    getDeliveredToArray(
      conversationId: $conversationId
      messageIndex: $messageIndex
    ) {
      message
      deliveredTo
    }
  }
`;

export const getDynamicConversationInfoQuery = (fields) => {
  // Create GraphQL query string dynamically
  return gql`
    query GetConversationInfo($conversationId: ID!) {
      getConversationInfo(conversationId: $conversationId) {
        ${fields.join("\n")}
      }
    }
  `;
};

export const GET_SEEN_BY_ARRAY = gql`
  query GetSeenByArray($conversationId: ID!, $messageIndex: Int!) {
    getSeenByArray(
      conversationId: $conversationId
      messageIndex: $messageIndex
    ) {
      message
      seenBy
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($conversationId: String!, $messageIndex: String!) {
    deleteMessage(conversationId: $conversationId, messageIndex: $messageIndex) {
      message
    }
  }
`;


export const MODIFY_CONVERSATION_NAME = gql`
mutation ModifyConversationName($conversationId: String!, $newName: String!) {
  modifyConversationName(conversationId: $conversationId, newName: $newName)
}
`;

export const NOTIFY_MESSAGE_IS_DELIVERED = gql`
  mutation NotifyMessageIsDelivered(
    $conversationIds: [ID]!
    $username: String!
  ) {
    notifyMessageIsDelivered(
      conversationIds: $conversationIds
      username: $username
    ) {
      message
    }
  }
`;

export const REMOVE_CHAT_MEMBER = gql`
  mutation RemoveChatMember($conversationId: ID!, $nameToRemove: String!) {
    removeChatMember(conversationId: $conversationId, nameToRemove: $nameToRemove) {
      conversation {
        participants
      }
    }
  }
`;
