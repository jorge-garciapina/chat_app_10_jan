import React from "react";
import {useSelector} from "react-redux";
import {Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const UsersTyping = ({interlocutors}) => {
  const {t} = useTranslation();
  const usersTyping = useSelector((state) => state.conversation.usersTyping);
  const isGroupalChat = useSelector((state) => state.conversation.isGroupalChat);


  let displayText;
  if (usersTyping.length === 0) {
    if (isGroupalChat) {
      displayText = interlocutors && interlocutors.length > 0 ? interlocutors.join(", ") : t("userstyping.na");
    } else {
      displayText = " ";
    }
  } else if (usersTyping.length === 1) {
    displayText = `${usersTyping[0]} ${t("userstyping.isTyping")}`;
  } else if (usersTyping.length === 2) {
    displayText = `${usersTyping[0]} ${t("userstyping.isTyping")}, ${usersTyping[1]} ${t("userstyping.isTyping")}`;
  } else {
    displayText = `${usersTyping.length} ${t("userstyping.areTyping")}`;
  }

  return (
    <Typography variant="subtitle1">
      {displayText}
    </Typography>
  );
};

UsersTyping.propTypes = {
  interlocutors: PropTypes.array.isRequired,
};

export default UsersTyping;
