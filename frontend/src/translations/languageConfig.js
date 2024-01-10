import i18n from "i18next";
import {initReactI18next} from "react-i18next";

// Importing the individual translation files
import enTranslation from "./english/enTranslation.json";
import frTranslation from "./french/frTranslation.json";
import itTranslation from "./italian/itTranslation.json";
import esTranslation from "./spanish/esTranslation.json";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {translation: enTranslation},
      fr: {translation: frTranslation},
      it: {translation: itTranslation},
      es: {translation: esTranslation},
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
