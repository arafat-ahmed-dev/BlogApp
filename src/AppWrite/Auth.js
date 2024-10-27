import { Client, Account, ID } from "appwrite";
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
      return session;
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }
  // password recovery
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
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser() :: ", error);
    }
  }
  async checkActiveSession() {
    try {
      const session = await this.account.getSession("current");
      if (session) {
        console.log("You are still logged in");
        return true; // Return true if an active session exists
      } else {
        console.log("You are not logged in");
        return false; // Return false if no active session exists
      }
    } catch (error) {
      console.log("Error checking session:", error);
      return false; // Return false if an error occurs
    }
  }
}

const authService = new AuthService();

export default authService;
