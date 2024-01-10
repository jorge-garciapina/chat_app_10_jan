import React, {useState} from "react";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {useCreateConversation} from "./../graphqlOperations/convClient";
import PropTypes from "prop-types";
import {TextField, Typography, Box} from "@mui/material";
import {useTranslation} from "react-i18next";


const CreateGroupConversation = ({onConversationCreated, cancelConversationCreation}) => {
  const [conversationName, setConversationName] = useState("");
  const [members, setMembers] = useState([]);

  const contactList = useSelector((state) => state.userInfo.contactList);
  const {createConversation} = useCreateConversation();

  const handleConversationNameChange = (e) => {
    setConversationName(e.target.value);
  };

  const addMember = (member) => {
    if (!members.includes(member)) {
      setMembers([...members, member]);
    }
  };

  const removeMember = (member) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleCreate = async () => {
    try {
      await createConversation({
        variables: {
          name: conversationName,
          participants: members,
          isGroupalChat: true,
        },
      });
      onConversationCreated();
    } catch (err) {
      console.error("Error executing mutation:", err);
    }
  };

  const isCreateDisabled = conversationName.trim() === "" || members.length === 0;

  const buttonStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "5px",
    "borderRadius": "10px",
    "&:hover": {
      background: "#75E6DA",
    },
  };

  const textFieldStyle = {
    "background": "#B1D4E0",
    "margin": "5px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#75E6DA",
      },
      "&:hover fieldset": {
        borderColor: "#0C2D48",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0C2D48",
      },
    },
  };
  const {t} = useTranslation();

  return (
    <Box sx={{padding: "20px", background: "#3E5A78", borderRadius: "10px"}}>
      <TextField
        sx={textFieldStyle}
        label={t("creategroupconversation.conversationName")}
        type="text"
        value={conversationName}
        onChange={handleConversationNameChange}
        variant="outlined"
        fullWidth
      />
      <Typography variant="subtitle1" sx={{color: "#FFFFFF", marginY: "20px"}}>
        {t("creategroupconversation.participants")}
      </Typography>
      <Box>
        {contactList.map((contact, index) => (
          <Box key={index} sx={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
            <Typography sx={{marginRight: "10px", color: "#FFFFFF"}}>
              {contact}
            </Typography>
            {members.includes(contact) ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeMember(contact)}
                sx={buttonStyle}
              >
                {t("creategroupconversation.cancel")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => addMember(contact)}
                sx={buttonStyle}
              >
                {t("creategroupconversation.add")}
              </Button>
            )}
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreate}
        disabled={isCreateDisabled}
        sx={buttonStyle}
      >
        {t("creategroupconversation.create")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={cancelConversationCreation}
        sx={buttonStyle}
      >
        {t("creategroupconversation.cancel")}
      </Button>
    </Box>
  );
};

CreateGroupConversation.propTypes = {
  onConversationCreated: PropTypes.func.isRequired,
  cancelConversationCreation: PropTypes.func.isRequired,
};

export default CreateGroupConversation;
