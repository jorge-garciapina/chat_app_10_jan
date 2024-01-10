import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {useSelector} from "react-redux"; // Import useSelector for accessing Redux state
import {
  useCreateConversation,
  useGetConversationsInfo,
} from "./../../graphqlOperations/convClient"; // Import the useCreateConversation hook
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


const ContactList = ({contacts}) => {
  // Extract username and onlineFriends from Redux state
  const username = useSelector((state) => state.userInfo.username);
  const onlineFriends = useSelector((state) => state.onlineFriends);
  const conversations = useSelector((state) => state.conversations);

  const fetchConversationInfo = useGetConversationsInfo(username);

  // Use the createConversation hook
  const {createConversation} = useCreateConversation();

  // Function to handle list item click
  const handleListItemClick = async (contactUsername) => {
    // The user clicks the name of any of his contacts

    try {
      const filterConversation = conversations.filter((conversation) => {
        return (
          !conversation.isGroupalChat &&
          conversation.participants.indexOf(contactUsername) !== -1
        );
      });

      if (!filterConversation[0]) {
        await createConversation({
          variables: {
            name: "oneToOneConversation",
            participants: [username, contactUsername],
            isGroupalChat: false,
          },
          onCompleted: (data) => {
            const conversationId = data.createConversation.conversationId;
            fetchConversationInfo(conversationId);
          },
        });
      } else {
        fetchConversationInfo(filterConversation[0].conversationId);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const listItemStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "5px",
    "borderRadius": "10px",
    "maxWidth": "95%",
    "boxSizing": "border-box",
    "&:hover": {
      background: "#75E6DA",
    }
  };

  const {t} = useTranslation();

  return (
    <List component="nav" id="list-contacts">
      {contacts && contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleListItemClick(contact)}
            sx={listItemStyle}
          >
            <ListItemText primary={contact + (onlineFriends.includes(contact) ?
              ` (${t("contactlist.online")})` : ` (${t("contactlist.offline")})`)} />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary={t("contactlist.noContacts")} />
        </ListItem>
      )}
    </List>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
};

export default ContactList;
