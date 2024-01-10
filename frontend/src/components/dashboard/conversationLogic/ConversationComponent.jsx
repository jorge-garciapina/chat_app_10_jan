import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useUserStatus} from "./../../graphqlOperations/userClient";
import SettingsComponent from "./conversationSettings/SettingsComponent";
import ConversationMessages from "./ConversationMessages";
import SendMessageItem from "./sendMessageItem";
import SettingsIcon from "@mui/icons-material/Settings";
import UsersTyping from "./UsersTyping";
import ConversationHeader from "./ConversationHeader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import {Box, Container} from "@mui/material";
import {useTranslation} from "react-i18next";

const Conversation = () => {
  const [showSettings, setShowSettings] = useState(false);
  const username = useSelector((state) => state.userInfo.username);
  const interlocutors = useSelector((state) => state.conversation.interlocutors);
  const allMessages = useSelector((state) => state.conversation.messages);
  const conversationName = useSelector((state) => state.conversation.name);
  const conversationId = useSelector((state) => state.conversation.conversationId);
  const participants = useSelector((state) => state.conversation.participants);
  const isParticipant = participants.includes(username);
  const isGroupalChat = useSelector((state) => state.conversation.isGroupalChat);

  const {t} = useTranslation();


  useUserStatus(interlocutors, username);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  const visibleMessages = allMessages.filter((message) => message.isVisible);

  const headerProps = showSettings ? {
    leftIcon: {
      icon: <ArrowBackIcon />,
      label: t("conversation.back"),
      onClick: handleBackClick,
    },
    title: conversationName,
    rightContent: <Typography>{t("conversation.settings")}</Typography>,
  } : {
    leftIcon: {
      icon: isGroupalChat ? <SettingsIcon />: "",
      label: t("conversation.settingsLabel"),
      onClick: isGroupalChat ? handleSettingsClick : handleBackClick,
    },
    title: conversationName,
    rightContent: <UsersTyping interlocutors={interlocutors} />,
  };

  return (
    <Box id="conversation-component">
      <Box id="conversation-header">
        <ConversationHeader {...headerProps} />
      </Box>
      <Container id="conversation-content">
        {showSettings ? (
          <SettingsComponent
            conversationName={conversationName}
            interlocutors={interlocutors}
            conversationId={conversationId}
            username={username}
            isParticipant={isParticipant}
            onBack={handleBackClick}
          />
        ) : (
          <Box id="conversation-messages">
            <ConversationMessages messages={visibleMessages} />
            <SendMessageItem />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Conversation;
