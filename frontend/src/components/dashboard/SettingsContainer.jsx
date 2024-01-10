import React, {useState} from "react";
import {useLogoutMutation} from "./../graphqlOperations/authClient";
import ChangeUsername from "./settingsLogic/ChangeUsername";
import ChangePassword from "./settingsLogic/ChangePassword";
import ChangeAvatar from "./settingsLogic/ChangeAvatar";
import LanguageSelector from "./../LanguageSelector";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

const SettingsContainer = () => {
  const {t} = useTranslation();
  const [currentComponent, setCurrentComponent] = useState("settings");
  const navigate = useNavigate();
  const logoutUser = useLogoutMutation(navigate);

  const buttonStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "5px",
    "borderRadius": "10px",
    "maxWidth": "95%",
    "boxSizing": "border-box",
    "justifyContent": "center",
    "&:hover": {
      background: "#75E6DA",
    },
  };

  const renderComponent = () => {
    switch (currentComponent) {
    case "changeUsername":
      return <ChangeUsername onBack={() => setCurrentComponent("settings")} />;
    case "changePassword":
      return <ChangePassword
        logoutUser={logoutUser}
        onBack={() => setCurrentComponent("settings")}
      />;
    case "changeAvatar":
      return <ChangeAvatar onBack={() => setCurrentComponent("settings")} />;
    case "changeLanguage":
      return <LanguageSelector onBack={() => setCurrentComponent("settings")} />;
    default:
      return (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          maxHeight: "100%",
          backgroundColor: "#0C2D48",
        }}>
          <Button sx={buttonStyle} onClick={() => setCurrentComponent("changeUsername")}>
            {t("settingscontainer.changeUsername")}
          </Button>
          <Button sx={buttonStyle} onClick={() => setCurrentComponent("changePassword")}>
            {t("settingscontainer.changePassword")}
          </Button>
          <Button sx={buttonStyle} onClick={() => setCurrentComponent("changeAvatar")}>
            {t("settingscontainer.changeAvatar")}
          </Button>
          <Button sx={buttonStyle} onClick={() => setCurrentComponent("changeLanguage")}>
            {t("settingscontainer.changeLanguage")}
          </Button>
          <Button sx={buttonStyle} onClick={logoutUser}>
            {t("settingscontainer.logout")}
          </Button>
        </Box>
      );
    }
  };

  return (
    <div id="settings-container">
      {renderComponent()}
    </div>
  );
};

export default SettingsContainer;
