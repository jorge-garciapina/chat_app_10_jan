import React from "react";
import {Box, Button, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useDeleteMessage} from "./../../graphqlOperations/convClient";

const MessageOptions = ({conversationId, messageIndex, onCancel, deliveredTo, seenBy}) => {
  const {t} = useTranslation();
  const deleteMessage = useDeleteMessage();

  const handleDeleteClick = async () => {
    try {
      await deleteMessage(conversationId, messageIndex);
      onCancel(); // Optionally, close the message options after deletion
    } catch (error) {
      console.error("Error during message deletion:", error);
    }
  };

  return (
    <Box>
      <Button onClick={handleDeleteClick}>{t("messageoptions.deleteMessage")}</Button>
      <Button onClick={onCancel}>{t("messageoptions.cancel")}</Button>
      <Typography>
        {t("messageoptions.deliveredTo")}: <strong>[{deliveredTo.join(", ")}]</strong>
      </Typography>
      <Typography>
        {t("messageoptions.seenBy")}: <strong>[{seenBy.join(", ")}]</strong>
      </Typography>
    </Box>
  );
};

MessageOptions.propTypes = {
  conversationId: PropTypes.string.isRequired,
  messageIndex: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  deliveredTo: PropTypes.array.isRequired,
  seenBy: PropTypes.array.isRequired,
};

export default MessageOptions;
