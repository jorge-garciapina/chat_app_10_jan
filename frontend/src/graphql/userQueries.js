import {gql} from "@apollo/client";

export const ACCEPT_CONTACT_REQUEST_MUTATION = gql`
  mutation AcceptContactRequest($senderUsername: String!) {
    acceptContactRequest(senderUsername: $senderUsername) {
      message
      onlineFriends
    }
  }
`;

export const CANCEL_CONTACT_REQUEST = gql`
  mutation CancelContactRequest($receiverUsername: String!) {
    cancelRequest(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const DELETE_CHAT_MUTATION = gql`
  mutation DeleteChat($conversationId: String!, $username: String!) {
    deleteChat(conversationId: $conversationId, username: $username) {
      message
    }
  }
`;

export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteContact($receiverUsername: String!) {
    deleteContact(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const GET_CONVERSATIONS_QUERY = gql`
  query GetConversations {
    getConversations {
      conversationId
      name
      lastMessage {
        content
        sender
      }
    }
  }
`;

export const GET_USER_STATUS_QUERY = gql`
  query GetUserStatuses($usernames: [String!]!) {
    getUserStatuses(usernames: $usernames) {
      username
      onlineStatus
    }
  }
`;

export const INFO_QUERY = gql`
  query UserInfo {
    userInfo {
      avatar
      pendingContactRequests {
        receiver
      }
      receivedContactRequests {
        sender
      }
      rejectedContactRequests {
        sender
      }
      username
      contactList
      onlineFriends

      conversations {
        conversationId
        name
        isGroupalChat
        participants
        date
        lastMessage {
          sender
          content
        }
      }
    }
  }
`;

export const REJECT_CONTACT_REQUEST_MUTATION = gql`
  mutation RejectContactRequest($senderUsername: String!) {
    rejectContactRequest(senderUsername: $senderUsername) {
      message
    }
  }
`;

export const RETRIEVE_CONTACT_REQUESTS = gql`
  query RetrieveContactRequests {
    retrieveContactRequests
  }
`;

export const RETRIEVE_PENDING_CONTACT_REQUESTS = gql`
  query RetrievePendingContactRequests {
    retrievePendingContactRequests
  }
`;

export const SEARCH_USERS = gql`
  query SearchUser($searchTerm: String) {
    searchUser(searchTerm: $searchTerm) {
      username
      avatar
    }
  }
`;

export const SEND_CONTACT_REQUEST = gql`
  mutation SendContactRequest($receiverUsername: String!) {
    sendContactRequest(receiverUsername: $receiverUsername) {
      message
    }
  }
`;

export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($newName: String!) {
    updateUsername(newName: $newName)
  }
`;

export const CHANGE_AVATAR_IMAGE_MUTATION = gql`
  mutation ChangeAvatarImage($avatarImage: String!) {
    changeAvatarImage(avatarImage: $avatarImage) {
      message
      avatarImage
    }
  }
`;
