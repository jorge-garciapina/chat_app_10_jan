import React from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useDeleteChat} from "./../../../graphqlOperations/userClient";
import {Box, Typography} from "@mui/material";

const DeleteChatFromUserProfile = ({conversationId, username, onBack, onClose}) => {
  const {t} = useTranslation();
  const deleteChat = useDeleteChat();

  const handleDelete = async () => {
    try {
      await deleteChat(conversationId, username);
      onBack();
    } catch (error) {
      console.error("Error deleting chat from user profile:", error);
    }
  };

  return (
    <Box sx={{
      padding: "20px",
      background: "#0C2D48",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: 3,
      maxWidth: 400,
      margin: "auto"
    }}>
      <Typography variant="h6" sx={{color: "#FFFFFF", marginBottom: "20px"}}>
        {t("deletechatfromuserprofile.confirmationText")}
      </Typography>
      <Button
        variant="contained"
        sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}}}
        onClick={handleDelete}
      >
        {t("deletechatfromuserprofile.deleteButton")}
      </Button>
      <Button
        variant="contained"
        sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}}}
        onClick={onClose}
      >
        {t("deletechatfromuserprofile.back")}
      </Button>
    </Box>
  );
};

DeleteChatFromUserProfile.propTypes = {
  conversationId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteChatFromUserProfile;
