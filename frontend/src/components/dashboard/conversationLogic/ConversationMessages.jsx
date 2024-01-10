import React, {useState} from "react";
import {Box, List, ListItem, Typography, Divider} from "@mui/material";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import MessageOptions from "./MessageOptions";

const ConversationMessages = ({messages}) => {
  const {t} = useTranslation();
  const username = useSelector((state) => state.userInfo.username);
  const conversationId = useSelector((state) => state.conversation.conversationId);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);

  const handleListItemClick = (index) => {
    if (selectedMessageIndex !== index) {
      setSelectedMessageIndex(index);
    } else {
      setSelectedMessageIndex(null); // Deselect if the same message is clicked again
    }
  };

  const handleCancel = () => {
    setSelectedMessageIndex(null);
  };

  return (
    <List id="list-messages">
      {messages.slice().reverse().map((message, index) => (
        <ListItem
          key={index}
          className="message-container"
        >
          <Box
            onClick={() => message.sender === username && handleListItemClick(index)}
            style={{cursor: message.sender === username ? "pointer" : "default"}}
            className={message.sender === username ? "message message-sent" : "message message-received"}
          >
            <Typography id="message-sender">
              {message.sender}
            </Typography>
            {selectedMessageIndex === index ? (
              <MessageOptions
                conversationId={conversationId}
                messageIndex={message.index.toString()}
                onCancel={handleCancel}
                className={message.sender === username ? "message message-sent" : "message message-received"}
                deliveredTo={message.deliveredTo}
                seenBy={message.seenBy}
              />
            ) : (
              <>
                {message.sender === username ? (
                  <>
                    <Typography sx={{fontSize: "medium", fontWeight: 550}}>
                      {message.content}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography>
                      {t("conversationmessages.deliveredToAll")}:
                      <strong>{message.deliveredToAllReceivers.toString()}</strong>
                    </Typography>
                    <Typography>
                      {t("conversationmessages.seenByAll")}: <strong>{message.seenByAllReceivers.toString()}</strong>
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{fontSize: "medium", fontWeight: 550}}>
                    {message.content}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

ConversationMessages.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default ConversationMessages;
