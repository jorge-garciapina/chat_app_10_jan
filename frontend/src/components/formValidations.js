// formValidations.js

export const validateUsername = (username) => {
  return username.length <= 30 && /^[a-zA-Z0-9]*$/.test(username);
};

export const validateEmail = (email) => {
  return email.length <= 50;
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateSearchTerm = (term) => {
  return term.length <= 30 && /^[a-zA-Z0-9]*$/.test(term);
};

export const validateMessageLength = (message) => {
  return message.length <= 800;
};
