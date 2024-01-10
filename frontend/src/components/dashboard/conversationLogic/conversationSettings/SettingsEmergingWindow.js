import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const SettingsEmergingWindow = ({children, onClose}) => {
  const windowStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    backgroundColor: "#0C2D48",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
  };

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  const handleClickOutside = (event) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <>
      <div style={overlayStyles} onClick={handleClickOutside} />
      <Box style={windowStyles} onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </>
  );
};

SettingsEmergingWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default SettingsEmergingWindow;
