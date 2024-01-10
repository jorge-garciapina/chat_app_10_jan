import React, {useState} from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";
import {useChangeAvatarImage} from "./../../graphqlOperations/userClient";
import {useTranslation} from "react-i18next";

const ChangeAvatar = ({onBack}) => {
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isAvatarSelected, setIsAvatarSelected] = useState(false);
  const changeAvatarImage = useChangeAvatarImage();

  const avatars = Array.from({length: 10}, (_, i) => `/static/avatarImages/avatar${i}.png`);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    setIsAvatarSelected(true);
  };

  const handleCancel = () => {
    setIsAvatarSelected(false);
  };

  const handleConfirm = async () => {
    try {
      // Extract the image file name from the selected avatar"s URL
      await changeAvatarImage(selectedAvatar);
      console.log("Avatar name changed");
    } catch (error) {
      console.error("Error updating avatar image:", error);
    }
    setIsAvatarSelected(false);
  };

  const {t} = useTranslation();
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      background: "#0C2D48",
      borderRadius: "10px",
      margin: "5px",
      maxWidth: "100%",
      boxSizing: "border-box",
    }}>
      <Typography variant="h6" sx={{color: "#FFFFFF", marginBottom: "20px"}}>
        {t("changeavatar.chooseAvatar")}
      </Typography>

      {!isAvatarSelected ? (
        <Grid container spacing={2}>
          {avatars.map((avatar, index) => (
            <Grid item xs={3} key={index}>
              <Card>
                <CardActionArea onClick={() => handleAvatarClick(avatar)}>
                  <CardMedia
                    component="img"
                    image={avatar}
                    alt={`Avatar ${index}`}
                    sx={{objectFit: "contain"}}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{textAlign: "center"}}>
          <CardMedia
            component="img"
            image={selectedAvatar}
            alt="Selected Avatar"
            sx={{height: "280px", maxWidth: "100%", objectFit: "contain"}}
          />
          <Box sx={{marginTop: "20px"}}>
            <Button
              sx={{"margin": "0 10px", "background": "#75E6DA", "&:hover": {background: "#B1D4E0"}}}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              sx={{"margin": "0 10px", "background": "#B1D4E0", "&:hover": {background: "#75E6DA"}}}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Button
        sx={{
          "background": "#B1D4E0",
          "marginTop": "10px",
          "borderRadius": "10px",
          "&:hover": {
            background: "#75E6DA",
          },
        }}
        onClick={onBack}
      >
        {t("changeavatar.back")}
      </Button>
    </Box>
  );
};

ChangeAvatar.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ChangeAvatar;
