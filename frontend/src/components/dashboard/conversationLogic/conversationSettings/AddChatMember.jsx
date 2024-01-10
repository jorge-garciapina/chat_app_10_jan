import React, {useState} from "react";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useAddChatMember} from "./../../../graphqlOperations/convClient";
import {Box, Typography, List, ListItem} from "@mui/material";

const AddChatMember = ({onClose}) => {
  const {t} = useTranslation();
  const [members, setMembers] = useState([]);
  const interlocutors = useSelector((state) => state.conversation.interlocutors);
  const contactList = useSelector((state) => state.userInfo.contactList);
  const addChatMember = useAddChatMember();
  const conversationId = useSelector((state) => state.conversation.conversationId);

  const addMember = (member) => {
    if (!members.includes(member)) {
      setMembers([...members, member]);
    }
  };

  const removeMember = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleSaveClick = async () => {
    try {
      await addChatMember(conversationId, members);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error while adding members:", error);
    }
  };

  const friendsNoPartOfConversation = contactList.filter((contact) => !interlocutors.includes(contact));

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
        {t("addchatmember.title")}
      </Typography>

      {friendsNoPartOfConversation.length === 0 ? (
        <Typography variant="subtitle1" sx={{color: "#FFFFFF"}}>
          {t("addchatmember.noFriendsToAdd")}
        </Typography>
      ) : (
        <List>
          {friendsNoPartOfConversation.map((contact, index) => (
            <ListItem key={index} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <Typography sx={{color: "#FFFFFF"}}>
                {contact}
              </Typography>
              {members.includes(contact) ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeMember(contact)}
                >
                  {t("addchatmember.cancel")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addMember(contact)}
                >
                  {t("addchatmember.add")}
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}, "marginTop": "10px"}}
        onClick={handleSaveClick}
      >
        {t("addchatmember.save")}
      </Button>
      <Button
        variant="contained"
        sx={{"backgroundColor": "#B1D4E0", "&:hover": {backgroundColor: "#75E6DA"}, "marginTop": "10px"}}
        onClick={onClose}
      >
        {t("addchatmember.back")}
      </Button>
    </Box>
  );
};

AddChatMember.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddChatMember;
