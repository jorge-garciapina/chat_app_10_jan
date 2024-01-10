// AppBarContainer.js
import React, {useState, useRef, useEffect} from "react";
import {useSelector} from "react-redux";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchComponent from "./searchLogic/SearchComponent";
import ContactRequestsContainer from "./ContactRequestsContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsContainer from "./SettingsContainer";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import Avatar from "@mui/material/Avatar";

/**
 * AppBarContainer component contains the logic to present the elements
 * in the bar at the top of the app.
 */
export default function AppBarContainer() {
  const [showContactRequests, setShowContactRequests] = useState(false);
  const contactRequestsRef = useRef(null); // Ref for the contact requests container
  const username = useSelector((state) => state.userInfo.username);
  const avatarImage = useSelector((state) => state.userInfo.avatarImage);

  const contactRequests = useSelector((state) => state.userInfo.contactRequests);


  const toggleContactRequests = () => {
    setShowContactRequests(!showContactRequests);
  };

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null); // Ref for the settings container

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };


  useEffect(() => {
  /**
 * AppBarContainer component contains the logic to present the elements
 * in the bar at the top of the app.
 */
    function handleClickOutside(event) {
      // Hide contact requests container
      if (contactRequestsRef.current && !contactRequestsRef.current.contains(event.target)) {
        setShowContactRequests(false);
      }
      // Hide settings container
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <Box className="appBar">
      <MuiAppBar position="static">
        <Toolbar style={{height: "100%"}}>
          <Avatar alt="Remy Sharp" src={avatarImage}/>
          <Typography component="h1" variant="h4" color="inherit" noWrap sx={{flexGrow: 1}}>
            {username}
          </Typography>

          <SearchComponent />
          <Box>
            <IconButton color="inherit" onClick={toggleContactRequests}>
              <Badge badgeContent={contactRequests.length} color="secondary">
                <AddReactionIcon />
              </Badge>
            </IconButton>
            {showContactRequests && (
              <Box ref={contactRequestsRef}>
                <ContactRequestsContainer />
              </Box>
            )}
          </Box>

          <Box>
            {/* Settings icon and container */}
            <IconButton color="inherit" onClick={toggleSettings}>
              <SettingsIcon />
            </IconButton>
            {showSettings && (
              <Box ref={settingsRef}>
                <SettingsContainer />
              </Box>
            )}
          </Box>

        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}
