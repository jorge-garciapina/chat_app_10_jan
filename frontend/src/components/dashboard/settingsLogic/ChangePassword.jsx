import React, {useState} from "react";
import {useChangePasswordMutation} from "./../../graphqlOperations/authClient";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";


const ChangePassword = ({onBack, logoutUser}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const changePassword = useChangePasswordMutation();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      setPasswordsMatch(true);
      await changePassword({variables: {oldPassword, newPassword}});
      logoutUser();
    } else {
      setPasswordsMatch(false);
    }
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

  const {t} = useTranslation();

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
      <Typography sx={{color: "#FFFFFF", marginBottom: "10px"}}>
        {t("changepassword.infoText")}
      </Typography>
      <form onSubmit={handlePasswordSubmit}>
        <TextField
          sx={textFieldStyle}
          type="password"
          label={t("changepassword.oldPassword")}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          sx={textFieldStyle}
          error={!passwordsMatch}
          type="password"
          label={t("changepassword.newPassword")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          sx={textFieldStyle}
          error={!passwordsMatch}
          type="password"
          label={t("changepassword.confirmNewPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          helperText={!passwordsMatch && t("changepassword.passwordMismatch")}
        />
        <Button sx={buttonStyle} type="submit" variant="contained">
          {t("changepassword.changePassword")}
        </Button>
      </form>
      <Button sx={buttonStyle} onClick={onBack} variant="contained">
        {t("changepassword.back")}
      </Button>
    </Box>
  );
};

ChangePassword.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ChangePassword;
