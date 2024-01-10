import React, {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {useModifyConversationName} from "./../../../graphqlOperations/convClient";
import {Box} from "@mui/material";

const ChangeChatName = ({conversationName, conversationId, onClose}) => {
  const {t} = useTranslation();
  const [newName, setNewName] = useState(conversationName);
  const modifyConversationName = useModifyConversationName();

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

  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const handleClick = async () => {
    try {
      await modifyConversationName(conversationId, newName);
      onClose();
    } catch (error) {
      console.error("Failed to modify conversation name:", error);
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
      <TextField
        variant="outlined"
        value={newName}
        onChange={handleChange}
        fullWidth
        sx={textFieldStyle}
      />
      <Button
        variant="contained"
        sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}, "marginTop": "10px"}}
        onClick={handleClick}
      >
        {t("changechatname.confirmChange")}
      </Button>
      <Button
        variant="contained"
        sx={{"backgroundColor": "#B1D4E0", "&:hover": {backgroundColor: "#75E6DA"}, "marginTop": "10px"}}
        onClick={onClose}
      >
        {t("changechatname.back")}
      </Button>
    </Box>
  );
};

ChangeChatName.propTypes = {
  conversationName: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangeChatName;
