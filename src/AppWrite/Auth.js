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
      // Check if there is a current session
      let session;
      try {
          session = await this.account.getSession("current");
          console.log(session, "---------> session");
      } catch (error) {
          console.log("No existing session found. Creating new one...",error);
      }

      // If no session, create a new session with email and password
      if (!session) {
          session = await this.account.createEmailPasswordSession(email, password);
          console.log(session, "-------------> New session created");
      }

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

  async getCurrentUser() {
    try {
      await this.account.get();
    } catch (error) {
      throw error;
    }
    return null;
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
