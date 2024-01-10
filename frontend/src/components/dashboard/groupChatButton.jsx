import Button from "@mui/material/Button";
import React, {useState} from "react";
import CreateGroupConversation from "./CreateGroupChat";
import {useTranslation} from "react-i18next";

const CreateGroupConversationButton = () => {
  const {t} = useTranslation();
  const [showCreateComponent, setShowCreateComponent] = useState(false);

  const handleCreateGroupConversation = () => {
    setShowCreateComponent(!showCreateComponent);
  };

  const handleConversationCreated = () => {
    setShowCreateComponent(false);
  };

  const cancelConversationCreation = ()=> {
    setShowCreateComponent(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateGroupConversation}
      >
        {t("creategroupconversationbutton.createGroupConversation")}
      </Button>
      {showCreateComponent && (
        <CreateGroupConversation
          onConversationCreated={handleConversationCreated}
          cancelConversationCreation = {cancelConversationCreation}
        />
      )}
    </div>
  );
};

export default CreateGroupConversationButton;
