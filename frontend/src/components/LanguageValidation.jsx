import React from "react";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/**
 * LanguageSelectorValidation component allowing the user to switch between different languages.
 * It uses the i18n instance from the `useTranslation` hook to change the application's language.
 */
function LanguageSelectorValidation() {
  const {i18n, t} = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("selectedLang", lang);
  };

  const buttonStyle = {
    // "background": "#B1D4E0",
    "margin": "1px",
    "borderRadius": "10px",
    "maxWidth": "80%",
    "padding": "5px",
    "boxSizing": "border-box",
    "justifyContent": "center",
    "fontSize": "14px",
    "&:hover": {
      background: "#75E6DA",
    },
  };
  return (
    <Box >
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

export default LanguageSelectorValidation;
