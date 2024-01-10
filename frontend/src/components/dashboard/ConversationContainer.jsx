// ConversationContainer.js
import React from "react";
import Box from "@mui/material/Box";
import Conversation from "./conversationLogic/ConversationComponent";

/**
 * ConversationContainer component contains the logic to present the
 * conversation (messages, send a message, etc)
 */
export default function ConversationContainer() {
  return (
    <Box sx={{height: "100%"}}>
      <Conversation />
    </Box>
  );
}
