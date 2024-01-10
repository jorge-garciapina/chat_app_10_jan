import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {useSelector} from "react-redux";
import ChangeChatName from "./ChangeChatName";
import AddChatMember from "./AddChatMember";


import SettingsEmergingWindow from "./SettingsEmergingWindow";
import ManageChatMember from "./ManageChatMember";
import LeaveConversation from "./LeaveConversation";
import DeleteChatFromUserProfile from "./DeleteChatFromUserProfile";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

const SettingsComponent = ({onBack, conversationName, interlocutors, conversationId, username, isParticipant}) => {
  const [showEmergingWindow, setShowEmergingWindow] = useState(false);
  const [emergingWindowContent, setEmergingWindowContent] = useState(null);
  const adminsInConversation = useSelector((state) => state.conversation.admins);

  useEffect(() => {
    if (conversationId === null) {
      onBack();
    }
  }, [conversationId, onBack]);

  const handleCloseEmergingWindow = () => {
    setShowEmergingWindow(false);
  };

  const handleActionClick = (component) => {
    setEmergingWindowContent({
      component: React.cloneElement(component, {onClose: handleCloseEmergingWindow}),
    });
    setShowEmergingWindow(true);
  };

  const isUserAdmin = adminsInConversation.includes(username);

  const listItemStyle = {
    "display": "flex",
    "background": "#75E6DA",
    "margin": "5px",
    "borderRadius": "10px",
    "maxWidth": "95%",
    "boxSizing": "border-box",
    "&:hover": {
      background: "#3E5A78",
    }
  };

  const buttonStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "5px",
    "borderRadius": "10px",
    "&:hover": {
      background: "#75E6DA",
    },
  };
  const {t} = useTranslation();

  return (
    <Box>
      <Box id="default-buttons">
        {isParticipant ? (
          <Button
            variant="contained"
            color="primary"
            sx={buttonStyle}
            onClick={() => handleActionClick(
              <LeaveConversation
                conversationId={conversationId}
                username={username}
                adminsInConversation={adminsInConversation}
                onBack={onBack}
                onClose={handleCloseEmergingWindow}
              />, t("settingscomponent.leave"))}>
            {t("settingscomponent.leave")} {conversationName}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={buttonStyle}
            onClick={() => handleActionClick(
              <DeleteChatFromUserProfile
                conversationId={conversationId}
                username={username}
                onBack={onBack}
                onClose={handleCloseEmergingWindow}

              />, t("settingscomponent.delete"))}>
            {t("settingscomponent.delete")} {conversationName}
          </Button>
        )}
      </Box>
      <Box id="list-of-participants-in-settings">
        <List component="nav">
          {interlocutors.map((interlocutor, index) => (
            <ListItem
              button
              key={index}
              sx={listItemStyle}
              onClick={() => isUserAdmin && handleActionClick(
                <ManageChatMember
                  interlocutorName={interlocutor}
                  conversationId={conversationId}
                  adminsInConversation={adminsInConversation}
                  onClose={handleCloseEmergingWindow}
                />, t("settingscomponent.manage"))}
            >
              <ListItemText primary={interlocutor + (adminsInConversation.includes(interlocutor) ?
                ` (${t("settingscomponent.admin")})` : "")} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box id="admin-buttons">
        {isUserAdmin && (
          <>
            <Button variant="contained" color="primary"
              sx={buttonStyle}
              onClick={() => handleActionClick(
                <ChangeChatName
                  conversationName={conversationName}
                  conversationId={conversationId}
                  onClose={handleCloseEmergingWindow}
                />, t("settingscomponent.modifyConversationName"))}>
              {t("settingscomponent.modifyConversationName")}
            </Button>

            <Button variant="contained" color="primary"
              sx={buttonStyle}
              onClick={() => handleActionClick(
                <AddChatMember
                  onClose={handleCloseEmergingWindow}
                />, t("settingscomponent.addUser"))}>
              {t("settingscomponent.addUser")}
            </Button>
          </>
        )}
      </Box>
      {showEmergingWindow && (
        <SettingsEmergingWindow
          onClose={handleCloseEmergingWindow}
          headerText={emergingWindowContent.headerText}
        >
          {emergingWindowContent.component}
        </SettingsEmergingWindow>
      )}
    </Box>
  );
};

SettingsComponent.propTypes = {
  onBack: PropTypes.func.isRequired,
  conversationName: PropTypes.string,
  conversationId: PropTypes.string,
  interlocutors: PropTypes.arrayOf(PropTypes.string).isRequired,
  username: PropTypes.string.isRequired,
  isParticipant: PropTypes.bool.isRequired,
};

export default SettingsComponent;
