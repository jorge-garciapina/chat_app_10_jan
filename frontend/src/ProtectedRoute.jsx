import React from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {Navigate, useLocation} from "react-router-dom";
import {useValidateUser} from "./components/graphqlOperations/authClient";

const ProtectedRoute = ({children}) => {
  useValidateUser();

  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/" />;
  } else if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
