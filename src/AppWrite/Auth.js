import { Client, Account, ID, OAuthProvider } from "appwrite";
import conf from "../conf/conf.js";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // Call login to create a session after account creation
        return await this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Appwrite service :: createAccount :: error", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      if (session) {
        // Store session in localStorage
        localStorage.setItem("session", JSON.stringify(session));
        return session;
      }
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      // Remove session from localStorage
      localStorage.removeItem("session");
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }

  async recoverPassword({ email, redirectUrl }) {
    try {
      const response = await this.account.createRecovery(email, redirectUrl);
      return response;
    } catch (error) {
      console.error("Appwrite service :: recoverPassword :: error", error);
      throw error;
    }
  }

  async updatePassword({ userId, secret, password, confirmPassword }) {
    try {
      const response = await this.account.updateRecovery(
        userId,
        secret,
        password,
        confirmPassword
      );
      return response;
    } catch (error) {
      console.error("Appwrite service :: updatePassword :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const session = await this.getSessionFromStorage(); // Check if session exists
      if (session) {
        return await this.account.get(); // Return the user data
      } else {
        console.log("No active session found.");
        return null;
      }
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async checkActiveSession() {
    try {
      const session = await this.account.getSession("current");
      if (session) {
        console.log("You are still logged in");
        return true;
      } else {
        console.log("You are not logged in");
        return false;
      }
    } catch (error) {
      console.log("Appwrite service :: checkActiveSession :: error", error);
      return false;
    }
  }

  // Helper method to get session from localStorage
  async getSessionFromStorage() {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      return session;
    }
    return null;
  }

  async googleLogin() {
    try {
      const response = await this.account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:5173/oauth",
        "http://localhost:5173/login"
      );
      console.log("Google Login Response:", response); // Log the response to inspect

      return response;
    } catch (error) {
      console.error("Appwrite service :: googleLogin :: error", error); // Log error
      throw error;
    }
  }
  // Optional: Redirect to login page if user is not logged in
  redirectToLogin() {
    // This can be a place where you handle UI redirects
    // Example: window.location.href = '/login';
    console.log("Redirecting to login...");
  }
}

const authService = new AuthService();
export default authService;
