// import * as React from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
  LOGOUT_USER_MUTATION,
  OFFLINE_USER_MUTATION,
  LOGIN_MUTATION,
  VALIDATE_USER_OPERATION,
  REGISTER_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from "./../../graphql/authQueries";

import {useDispatch} from "react-redux";
import {authUser, setToInitialState} from "./../../redux/actions";

export const useChangePasswordMutation = (setAlertMessage, setShowAlert, setPruebaValor) => {
  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: (data) => {
    },
    onError: (error) => {
      const errorMessage = "An unexpected error occurred.";
      console.error(errorMessage);

      if (error.graphQLErrors.length > 0) {
        // errorMessage = error.graphQLErrors[0].message;
      }
    },
  });

  return changePassword;
};

// LOGIN_MUTATION
export const useLoginMutation = (navigate, setAlertMessage, setShowAlert) => {
  const dispatch = useDispatch();

  const [loginUser] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.loginUser.token) {
        dispatch(authUser(true));
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      let errorMessage = "An unexpected error occurred.";
      if (error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error. Please try again later.";
      }
      setAlertMessage(errorMessage);
      setShowAlert(true);
    },
  });

  return loginUser;
};

// LOGOUT_USER_MUTATION
export const useLogoutMutation = (navigate, setAlertMessage, setShowAlert) => {
  const dispatch = useDispatch();
  const [logoutUser] = useMutation(LOGOUT_USER_MUTATION, {
    onCompleted: (data) => {
      // Clear local storage items related to the user's session
      dispatch(setToInitialState());
      // Update the Redux state to reflect that the user is no longer authenticated
      dispatch(authUser(false));
      // Navigate the user to the login page
      navigate("/");
    },
    onError: (error) => {
      dispatch(authUser(false));

      // Navigate the user to the login page
      navigate("/");
    },
  });

  return logoutUser;
};

// OFFLINE_USER_MUTATION
export const useUserOffline = (navigate, setAlertMessage, setShowAlert) => {
  const dispatch = useDispatch();

  const [userOffline] = useMutation(OFFLINE_USER_MUTATION, {
    onCompleted: (data) => {
      // Clear local storage items related to the user's session
      dispatch(setToInitialState());
      // Update the Redux state to reflect that the user is no longer authenticated
      dispatch(authUser(false));
    },
    onError: (error) => {
      dispatch(authUser(false));

      // Navigate the user to the login page
      navigate("/");
    },
  });

  return userOffline;
};

// REGISTER_MUTATION
export const useRegisterMutation = (navigate, setValidationError) => {
  const dispatch = useDispatch();
  const [registerUser] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      if (data.registerUser && data.registerUser.token) {
        dispatch(authUser(true)); // Dispatch the action with true
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      if (error.graphQLErrors.length > 0) {
        setValidationError(error.graphQLErrors[0].message);
      } else if (error.networkError) {
        setValidationError("Network error. Please try again later.");
      } else {
        setValidationError("An unexpected error occurred.");
      }
    }
  });

  return registerUser;
};

// VALIDATE_USER_OPERATION
export const useValidateUser = () => {
  const dispatch = useDispatch();

  useQuery(VALIDATE_USER_OPERATION, {
    onCompleted: (data) => {
      dispatch(authUser(data.validateUserOperation.success));
    },
    onError: () => {
      dispatch(authUser(false));
    },
  });
};
