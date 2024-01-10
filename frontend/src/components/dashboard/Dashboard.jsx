// Dashboard.js
import React, {useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppBarContainer from "./AppBarContainer";
import SidebarContainer from "./SidebarContainer";
import ConversationContainer from "./ConversationContainer";
import {useUserInfo} from "./../graphqlOperations/userClient";
import Subscriptions from "./../graphqlOperations/Subscriptions";
import {useUserOffline} from "./../graphqlOperations/authClient";

import {useNavigate} from "react-router-dom";


import "./../../styles/dashboardStyles.scss";

/**
 * Dashboard component displaying the main interface
 * of the application with navigation and content sections.
 */
export default function Dashboard() {
  useUserInfo();

  const navigate = useNavigate();
  const userOffline = useUserOffline(navigate);

  useEffect(() => {
    const handleBeforeUnload = () => {
      userOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userOffline]);

  return (
    <Box id="main-dashboard-container">
      <Subscriptions />
      <CssBaseline />
      <Box id="app-bar">
        <AppBarContainer />
      </Box>
      <Box id="sidebar-container">
        <SidebarContainer />
      </Box>
      <Box id="conversation-container">
        <ConversationContainer />
      </Box>
    </Box>
  );
}

