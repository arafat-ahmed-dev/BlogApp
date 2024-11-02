import { Client, Account, ID ,OAuthProvider } from "appwrite";
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

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser() :: ", error);
    }
  }
  // add google oauth2
  async loginWithGoogle({redirectURI, loginURI}) {
    try {
      const session = await this.account.createOAuth2Session(
        OAuthProvider.Google,
        redirectURI,
        loginURI
      );
      return session;
    } catch (error) {
      console.log("Appwrite service :: loginWithGoogle() :: ", error);
    }
  }
  async loginWithGoogle() {
    const redirectURI = "http://localhost:5173";
    const loginURI = "http://localhost:5173/login";
    try {
      const session = await this.account.createOAuth2Session(
        OAuthProvider.Google,
        redirectURI,
        loginURI
      );
      return session;
    } catch (error) {
      this.handleError(error, 'loginWithGoogle');
    }
  }
  
  handleError(error, methodName) {
    console.error(`Appwrite service :: ${methodName}() :: `, error);
    // Optionally, you could throw the error or handle it according to your app's needs
  }
}

const authService = new AuthService();

export default authService;