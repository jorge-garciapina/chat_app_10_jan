import React, {useState} from "react";
import {useUpdateUsername} from "./../../graphqlOperations/userClient";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

const ChangeUsername = ({onBack}) => {
  const {t} = useTranslation();
  const [newUsername, setNewUsername] = useState("");
  const updateUsername = useUpdateUsername();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    await updateUsername(newUsername);
    onBack();
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

  const buttonStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "5px",
    "borderRadius": "10px",
    "&:hover": {
      background: "#75E6DA",
    },
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      background: "#0C2D48",
      borderRadius: "10px",
      margin: "5px",
      maxWidth: "95%",
      boxSizing: "border-box",
    }}>
      <Box component="form" onSubmit={handleUsernameSubmit}
        sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <TextField
          sx={textFieldStyle}
          label={t("changeusername.newUsername")}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <Button sx={buttonStyle} type="submit" variant="contained">
          {t("changeusername.updateUsername")}
        </Button>
      </Box>
      <Button sx={buttonStyle} onClick={onBack} variant="contained">
        {t("changeusername.back")}
      </Button>
    </Box>
  );
};

ChangeUsername.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ChangeUsername;
