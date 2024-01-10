import React, {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreateGroupConversationButton from "./groupChatButton";
import Contacts from "./contactsLogic/Contacts";
import Conversations from "./Conversations";
import {useTranslation} from "react-i18next";

/**
 * SidebarContainer component contains the logic to present the logic to display
 * the conversations, contacts and create a new conversation
 */
export default function SidebarContainer() {
  const [activeView, setActiveView] = useState("chats");
  const {t} = useTranslation();

  return (
    <Box>
      <Box>
        <Button
          variant={activeView === "chats" ? "contained" : "outlined"}
          onClick={() => setActiveView("chats")}
        >
          {t("sidebarcontainer.chats")}
        </Button>
        <Button
          variant={activeView === "contacts" ? "contained" : "outlined"}
          onClick={() => setActiveView("contacts")}
        >
          {t("sidebarcontainer.contacts")}
        </Button>
      </Box>

      {activeView === "chats" && (
        <Conversations />
      )}

      {activeView === "contacts" && (
        <>
          <CreateGroupConversationButton />
          <Contacts />
        </>
      )}
    </Box>
  );
}
