const {RESTDataSource} = require("apollo-datasource-rest");

/**
 * AuthService class for handling authentication-related operations.
 */
class AuthService extends RESTDataSource {
  /**
   * AuthService constructor.
   */
  constructor() {
    super();
    this.baseURL = process.env.AUTH_SERVICE_CONNECTION;
  }

  /**
   * Change a user's password using their authentication token
   * @param {Object} passwordData - Password change data.
   * @param {string} passwordData.token - Authentication token of the user.
   * @param {string} passwordData.oldPassword - Old password of the user.
   * @param {string} passwordData.newPassword - New password of the user.
   * @return {Promise<Object>} A promise that resolves with the change-password response.
   */
  async changePassword({token, oldPassword, newPassword}) {
    const response = await this.post("changePassword", {
      token,
      oldPassword,
      newPassword,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    console.log(response);
    return response;
  }

  /**
   * Retrieve a list of all registered users.
   * @return {Promise<Array>} A promise that resolves with the list of users.
   */
  async getUsers() {
    return this.get("users");
  }

  /**
   * Authenticate a user with their username and password.
   * @param {Object} credentials - User login credentials.
   * @param {string} credentials.username - Username of the user.
   * @param {string} credentials.password - Password of the user.
   * @return {Promise<Object>} A promise that resolves with the login response.
   */
  async loginUser({username, password}) {
    let response;
    try {
      response = await this.post("login", {username, password});
    } catch (error) {
      console.log(error);
    }

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Log out a user using their authentication token.
   * @param {Object} tokenData - Token data for the user.
   * @param {string} tokenData.token - Authentication token of the user.
   * @return {Promise<Object>} A promise that resolves with the logout response.
   */
  async logoutUser({token}) {
    const response = await this.post("logout", {token});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Register a new user with the provided email, username, and password.
   * @param {Object} userData - User data for registration.
   * @param {string} userData.email - Email of the user.
   * @param {string} userData.username - Username of the user.
   * @param {string} userData.password - Password of the user.
   * @return {Promise<Object>} A promise that resolves with the registration response.
   */
  async registerUser({email, username, password}) {
    const response = await this.post("register", {email, username, password});

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }


  /**
   * Change the status of a user to offline.
   * @param {Object} userData - Data for the user whose status is to be changed.
   * @return {Promise<Object>} Resolves with the response to the status change.
   */
  async updateUsername({validatedUser, newName}) {
    try {
      const response = await this.put("/updateUsername", {validatedUser, newName});
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      // Handle or forward the error as appropriate for your application
      console.error("Error updating username:", error);
      throw error;
    }
  }

  /**
   * Validate if the provided receiver is a registered and legitimate user.
   * @param {string} receiver - Receiver to validate.
   * @return {Promise<Object>} A promise that resolves with the validation response.
   */
  async validateMessageReceiver(receiver) {
    const response = await this.get(`validateMessageReciever/${receiver}`);

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  /**
   * Validate if a user operation is permissible using their authentication token.
   * @param {string} token - Authentication token of the user.
   * @return {Promise<Object>} A promise that resolves with the validation response.
   */
  async validateUserOperation(token) {
    const response = await this.get(
      "validateUserOperation",
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

module.exports = AuthService;
