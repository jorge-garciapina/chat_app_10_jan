// ContactRequestsContainer.js
import React from "react";
import {useSelector} from "react-redux";
import ContactRequests from "./ContactRequests";

const ContactRequestsContainer = () => {
  const contactRequests = useSelector((state) => state.userInfo.contactRequests);

  return (
    <div id="contact-requests-container">
      <ContactRequests requests={contactRequests} />
    </div>
  );
};

export default ContactRequestsContainer;
