import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import {useRegisterMutation} from "./graphqlOperations/authClient";
import LanguageSelectorValidation from "./LanguageValidation";
import {useTranslation} from "react-i18next";
import {submitRegister} from "./submitLogic";
import {validateUsername, validateEmail, validatePassword, validateConfirmPassword} from "./formValidations";

const defaultTheme = createTheme();
const avatars = Array.from({length: 10}, (_, i) => `/static/avatarImages/avatar${i}.png`);

/**
 * Register component .
 * Provides an interface for users to register with their username and password.
 */
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]); // Default to first avatar

  const {t} = useTranslation();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState("");

  const registerUser = useRegisterMutation(navigate, setValidationError);

  const handleEmailChange = (e) => {
    if (validateEmail(e.target.value)) {
      setEmail(e.target.value);
    }
  };

  const handleUsernameChange = (e) => {
    if (validateUsername(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAvatarClick = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setValidationError(t("register.invalidEmail"));
      return;
    }
    if (!validatePassword(password)) {
      setValidationError(t("register.passwordValidation"));
      return;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      setValidationError(t("register.passwordsMismatch"));
      return;
    }
    submitRegister(
      event,
      email,
      username,
      avatar,
      password,
      confirmPassword,
      registerUser,
      setValidationError
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("register.signUp")}
          </Typography>
          <LanguageSelectorValidation />

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{mt: 3}}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  fullWidth
                  id="username"
                  label={t("register.username")}
                  name="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  required
                  fullWidth
                  id="email"
                  label={t("register.emailAddress")}
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  fullWidth
                  name="password"
                  label={t("register.password")}
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t("register.confirmPassword")}
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{t("register.selectAvatar")}</Typography>
                <Box sx={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
                  {avatars.map((avatarSrc, index) => (
                    <Avatar
                      key={index}
                      src={avatarSrc}
                      sx={{
                        m: 1,
                        width: 56,
                        height: 56,
                        cursor: "pointer",
                        border: avatar === avatarSrc ? "5px solid blue" : "none"
                      }}
                      onClick={() => handleAvatarClick(avatarSrc)}
                      alt={`Avatar ${index}`}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            {validationError && (
              <p style={{color: "red"}}>{validationError}</p>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              {t("register.signUpButton")}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  {t("register.alreadyAccount")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
