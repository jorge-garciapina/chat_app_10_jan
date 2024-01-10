import React from "react";
import {useSelector} from "react-redux";

// OTHER REACT COMPONENTS
import ContactList from "./ContactList";

const Contacts = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const {contactList} = userInfo;

  return (
    <ContactList contacts={contactList} />
  );
};

export default Contacts;
