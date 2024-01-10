import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      username
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      message
      success
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!
    $username: String!
    $password: String!
    $avatar: String
  ) {
    registerUser(
      email: $email
      username: $username
      password: $password
      avatar: $avatar
    ) {
      token
      message
    }
  }
`;

export const VALIDATE_USER_OPERATION = gql`
  query ValidateUserOperation {
    validateUserOperation {
      success
      validatedUser
    }
  }
`;

export const LOGOUT_USER_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      token
      message
    }
  }
`;

export const OFFLINE_USER_MUTATION = gql`
  mutation UserOffline {
    userOffline {
      token
      message
    }
  }
`;

export const STATUS_BASED_ON_VIEW = gql`
  mutation UpdateStatusBasedOnView($token: String!, $location: String!) {
    updateStatusBasedOnView(token: $token, location: $location) {
      status
    }
  }
`;
