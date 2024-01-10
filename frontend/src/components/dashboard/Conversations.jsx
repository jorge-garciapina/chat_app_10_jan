import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {useSelector} from "react-redux";
import {useGetConversationsInfo} from "./../graphqlOperations/convClient";
import {useTranslation} from "react-i18next";

const Conversations = () => {
  const {t} = useTranslation();
  const username = useSelector((state) => state.userInfo.username);
  const unsortedConversations = useSelector((state) => state.conversations);

  // Sorting logic
  const conversations = [...unsortedConversations].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const fetchConversationInfo = useGetConversationsInfo(username);

  const handleClick = (conversation) => {
    fetchConversationInfo(conversation.conversationId);
  };

  return (
    <List id="list-conversations">
      {conversations.map((conversation, index) => (
        <ListItem
          key={index}
          button
          onClick={() => handleClick(conversation)}
          sx={{
            "display": "flex",
            "background": "#B1D4E0",
            "margin": "5px",
            "borderRadius": "10px",
            "maxWidth": "95%",
            "boxSizing": "border-box",
            "&:hover": {
              background: "#75E6DA",
            }
          }}
        >
          <ListItemText
            primary={conversation.name}
            secondary={
              conversation.lastMessage ?
                `${conversation.lastMessage.content.slice(0, 20)} ...`: t("conversations.noMessages")
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Conversations;
