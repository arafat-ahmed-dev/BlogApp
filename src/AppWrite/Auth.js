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
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  async login({email, password}) {
    try {
      const session = await this.account.getSession('current');
      if (session) {
        console.log('User  is already logged in');
        return session; // Return the existing session
      }
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login :: error", error);
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
    return null
  }
  async checkActiveSession() {
    try {
      const session = await this.account.getSession('current');
      if (session) {
        console.log('You are still logged in');
        return true; // Return true if an active session exists
      } else {
        console.log('You are not logged in');
        return false; // Return false if no active session exists
      }
    } catch (error) {
      console.log('Error checking session:', error);
      return false; // Return false if an error occurs
    }
  }
}

const authService = new AuthService();

export default authService;
