import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

import {
  useSendContactRequest,
  useCancelContactRequest,
} from "./../../graphqlOperations/userClient";

import {
  useCreateConversation,
  useGetConversationsInfo,
} from "./../../graphqlOperations/convClient";

const SearchResult = ({user}) => {
  const pendingContactRequests = useSelector(
    (state) => state.userInfo.pendingCR
  );
  const contactList = useSelector((state) => state.userInfo.contactList);
  const username = useSelector((state) => state.userInfo.username);
  const conversations = useSelector((state) => state.conversations);

  const fetchConversationInfo = useGetConversationsInfo(username);
  const {createConversation} = useCreateConversation();

  const isPendingRequest = pendingContactRequests.includes(user.username);
  const isContact = contactList.includes(user.username);

  const handleSendMessageClick = async () => {
    try {
      const filterConversation = conversations.filter((conversation) =>
        !conversation.isGroupalChat &&
        conversation.participants.indexOf(user.username) !== -1
      );

      if (!filterConversation[0]) {
        await createConversation({
          variables: {
            name: "oneToOneConversation",
            participants: [username, user.username],
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
      console.error("Error in handleSendMessageClick:", err);
    }
  };

  const {sendContactRequest, sending} = useSendContactRequest(
    pendingContactRequests,
    user.username
  );
  const {cancelRequest, cancelling} = useCancelContactRequest(user.username);

  const handleAddFriendClick = () => {
    sendContactRequest(user.username);
  };

  const handleCancelRequestClick = () => {
    cancelRequest(user.username);
  };

  const isButtonDisabled = sending || cancelling;

  const {t} = useTranslation();

  return (
    <ListItem className="search-result-item"
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
      {/* Avatar Image */}
      <ListItemAvatar className="search-result-avatar">
        <Avatar src={user.avatar} alt={user.username} />
      </ListItemAvatar>

      {/* Username */}
      <ListItemText primary={user.username} className="search-result-username" />

      {/* Button with different functionalities */}
      <div className="search-result-button">
        {!isContact ? (
          !isPendingRequest ? (
            <Button onClick={handleAddFriendClick} disabled={isButtonDisabled}>
              {sending ? t("searchresult.sending") : t("searchresult.addFriend")}
            </Button>
          ) : (
            <Button onClick={handleCancelRequestClick} disabled={isButtonDisabled}>
              {cancelling ? t("searchresult.cancelling") : t("searchresult.cancelRequest")}
            </Button>
          )
        ) : (
          <Button onClick={handleSendMessageClick} disabled={isButtonDisabled}>
            {t("searchresult.sendMessage")}
          </Button>
        )}
      </div>
    </ListItem>
  );
};

SearchResult.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired
};

export default SearchResult;
