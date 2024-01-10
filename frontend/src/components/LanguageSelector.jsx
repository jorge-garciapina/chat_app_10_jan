import React from "react";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/**
 * LanguageSelector component allowing the user to switch between different languages.
 * It uses the i18n instance from the `useTranslation` hook to change the application's language.
 */
function LanguageSelector() {
  const {i18n, t} = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLang", lang);
  };

  const buttonStyle = {
    "display": "flex",
    "background": "#B1D4E0",
    "margin": "1px",
    "borderRadius": "10px",
    "maxWidth": "95%",
    "boxSizing": "border-box",
    "justifyContent": "center",
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
      maxWidth: "100%",
      boxSizing: "border-box",
    }}>
      <Button sx={buttonStyle} variant="contained" color="primary" onClick={() => changeLanguage("en")}>
        {t("languageselector.english")}
      </Button>
      <Button sx={buttonStyle} variant="contained" color="primary" onClick={() => changeLanguage("fr")}>
        {t("languageselector.french")}
      </Button>
      <Button sx={buttonStyle} variant="contained" color="primary" onClick={() => changeLanguage("it")}>
        {t("languageselector.italian")}
      </Button>
      <Button sx={buttonStyle} variant="contained" color="primary" onClick={() => changeLanguage("es")}>
        {t("languageselector.spanish")}
      </Button>
    </Box>
  );
}

export default LanguageSelector;
