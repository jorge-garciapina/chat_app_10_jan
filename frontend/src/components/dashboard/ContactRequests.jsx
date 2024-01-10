import React, {useState} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import {
  useAcceptContactRequest,
  useRejectContactRequest,
} from "./../graphqlOperations/userClient";

import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

const ContactRequests = ({requests}) => {
  const [processing, setProcessing] = useState(false);
  const handleAcceptRequest = useAcceptContactRequest();
  const handleRejectRequest = useRejectContactRequest();

  // Function to handle accept request
  const acceptRequest = (contact) => {
    setProcessing(true);
    handleAcceptRequest(contact).finally(() => setProcessing(false));
  };

  // Function to handle reject request
  const rejectRequest = (contact) => {
    setProcessing(true);
    handleRejectRequest(contact).finally(() => setProcessing(false));
  };

  const {t} = useTranslation();
  return (
    <List component="nav" id="list-contact-requests">
      {requests && requests.length > 0 ? (
        requests.map((contact, index) => (
          <ListItem key={index}
            sx={{
              "display": "flex",
              "background": "#B1D4E0",
              "margin": "5px",
              "borderRadius": "10px",
              "maxWidth": "95%",
              "boxSizing": "border-box",
              "&:hover": {
                background: "#75E6DA",
              }
            }}
          >
            <ListItemText primary={contact} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => acceptRequest(contact)}
              disabled={processing}
            >
              {t("contactrequests.accept")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => rejectRequest(contact)}
              disabled={processing}
            >
              {t("contactrequests.reject")}
            </Button>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary={t("contactrequests.noRequests")}
            sx={{
              "color": "white"
            }}
          />
        </ListItem>
      )}
    </List>
  );
};

ContactRequests.propTypes = {
  requests: PropTypes.array.isRequired,
};

export default ContactRequests;
