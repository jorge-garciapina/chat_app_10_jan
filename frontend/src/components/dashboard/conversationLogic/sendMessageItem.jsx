import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import {useSelector} from "react-redux";
import {useAddMessageToConversation, useNotifyTypingEvent} from "./../../graphqlOperations/convClient";
import {validateMessageLength} from "./../../formValidations";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

const SendMessageItem = () => {
  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const conversationId = useSelector((state) => state.conversation.conversationId);
  const username = useSelector((state) => state.userInfo.username);
  const participants = useSelector((state) => state.conversation.participants);
  const isParticipant = participants.includes(username);

  const addMessageToConversation = useAddMessageToConversation();
  const notifyTypingEvent = useNotifyTypingEvent();

  const handleSendMessage = async () => {
    if (message.trim() && conversationId && validateMessageLength(message)) {
      try {
        await addMessageToConversation(conversationId, message);
        setMessage("");
      } catch (error) {
        console.error("Error while sending message:", error);
      }
    }
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (validateMessageLength(newMessage)) {
      setMessage(newMessage);
      notifyTypingEvent(username, conversationId, participants.filter((p) => p !== username));
    }
  };

  if (isParticipant) {
    return (
      <Box style={{display: "flex", alignItems: "center"}}
        sx={{
          background: "white",
          padding: "5px",
          backgroundColor: "#0C2D48"
        }}
      >
        <TextField
          variant="outlined"
          placeholder={t("sendmessageitem.typeMessage")}
          fullWidth
          value={message}
          onChange={handleMessageChange}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          sx={{
            backgroundColor: "#B1D4E0",
            borderRadius: "10px",
          }}
        />
      </Box>
    );
  } else {
    return (
      <div style={{marginTop: "1rem", color: "red"}}>
        {t("sendmessageitem.notPartOfConversation")}
      </div>
    );
  }
};

export default SendMessageItem;
