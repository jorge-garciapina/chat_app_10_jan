import React from "react";
import PropTypes from "prop-types";
import {AppBar, Toolbar, Typography, IconButton} from "@mui/material";

const ConversationHeader = ({leftIcon, title, rightContent}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left Icon */}
        {leftIcon && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label={leftIcon.label}
            sx={{mr: 2}}
            onClick={leftIcon.onClick}
          >
            {leftIcon.icon}
          </IconButton>
        )}

        <div style={{flexGrow: 1}}>
          {/* Title */}
          <Typography variant="h4" style={{flexGrow: 1}}>
            {title}
          </Typography>

          {/* Right Content */}
          {rightContent}
        </div>

      </Toolbar>
    </AppBar>
  );
};

ConversationHeader.propTypes = {
  leftIcon: PropTypes.object,
  title: PropTypes.string,
  rightContent: PropTypes.element,
};

export default ConversationHeader;
