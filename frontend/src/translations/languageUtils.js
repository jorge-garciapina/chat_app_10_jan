import i18n from "i18next";

/**
 * Initializes the language settings for the application.
 * Sets the i18n language to a stored language from localStorage if available,
 * otherwise defaults to English ('en').
 */
export function initializeLanguage() {
  const storedLang = localStorage.getItem("selectedLang");
  if (storedLang) {
    i18n.changeLanguage(storedLang);
  } else {
    localStorage.setItem("selectedLang", "en");
  }
}
