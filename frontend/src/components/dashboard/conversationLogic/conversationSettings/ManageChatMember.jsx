import React, {useState} from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
  useRemoveChatMember,
  useAddAdminToConversation,
  useRemoveAdminFromConversation
} from "./../../../graphqlOperations/convClient";

const ManageChatMember = ({interlocutorName, onClose, conversationId, adminsInConversation}) => {
  const {t} = useTranslation();
  const [action, setAction] = useState(null);
  const removeChatMember = useRemoveChatMember();
  const addAdminToConversation = useAddAdminToConversation();
  const removeAdminFromConversation = useRemoveAdminFromConversation();

  const handleConfirm = async () => {
    try {
      if (action === "removeFromChat") {
        await removeChatMember(conversationId, interlocutorName);
        if (adminsInConversation.includes(interlocutorName)) {
          await removeAdminFromConversation(conversationId, [interlocutorName]);
        }
      } else if (action === "setAsAdmin") {
        await addAdminToConversation(conversationId, [interlocutorName]);
      } else if (action === "removeAsAdmin") {
        await removeAdminFromConversation(conversationId, [interlocutorName]);
      }
      onClose();
    } catch (error) {
      console.error("Error managing chat member:", error);
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
      {!action ? (
        <>
          <Button
            variant="contained"
            sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}, "marginBottom": "10px"}}
            onClick={() => setAction("removeFromChat")}>
            {t("managechatmember.removeFromChat") + interlocutorName}
          </Button>
          <Button
            variant="contained"
            sx={{"backgroundColor": "#75E6DA", "&:hover": {backgroundColor: "#B1D4E0"}, "marginBottom": "10px"}}
            onClick={() => setAction(adminsInConversation.includes(interlocutorName) ? "removeAsAdmin" : "setAsAdmin")}>
            {adminsInConversation.includes(interlocutorName) ?
              t("managechatmember.removeAsAdmin") + interlocutorName :
              t("managechatmember.setAsAdmin") + interlocutorName}
          </Button>
          <Button
            variant="contained"
            sx={{"backgroundColor": "#B1D4E0"}}
            onClick={onClose}>
            {t("managechatmember.back")}
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{color: "#FFFFFF", marginBottom: "20px"}}>
            {t(`managechatmember.${action === "removeFromChat" ? "confirmRemoval" :
              action === "setAsAdmin" ? "confirmSetAdmin" :
                "confirmRemoveAdmin"}`)} of <strong>{interlocutorName}</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{"backgroundColor": "#75E6DA", "&:hover": {"backgroundColor": "#B1D4E0"}}}
            onClick={handleConfirm}>
            {t("managechatmember.confirm")}
          </Button>
          <Button
            variant="contained"
            sx={{"backgroundColor": "#75E6DA", "&:hover": {"backgroundColor": "#B1D4E0"}}}
            onClick={onClose}>
            {t("managechatmember.back")}
          </Button>
        </>
      )}
    </Box>
  );
};

ManageChatMember.propTypes = {
  interlocutorName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  conversationId: PropTypes.string.isRequired,
  adminsInConversation: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ManageChatMember;
