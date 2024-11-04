import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createProfile({
    profileName,
    bio,
    imageprofileImage,
    email,
    userId,
    Country,
  }) {
    try {
      return await this.databases.createDocument(
        conf.databaseId,
        conf.profileCollectionId,
        ID.unique(),
        {
          profileName,
          bio,
          imageprofileImage,
          email,
          userId,
          Country,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createPost() :: ", error);
      return false;
    }
  }

  async getProfile(userId) {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.profileCollectionId,
        [Query.equal("userId", userId)]
      );
      return response;
    } catch (error) {
      console.error("Appwrite service :: getProfile() :: ", error);
      return null;
    }
  }
  async updateProflie(
    userId,
    { profileName, bio, email, imageprofileImage, Country }
  ) {
    try {
      return await this.databases.updateDocument(
        conf.databaseId,
        conf.appCollectionId,
        userId,
        {
          profileName,
          bio,
          email,
          imageprofileImage,
          Country,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateProfile() :: ", error);
      return false;
    }
  }
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(conf.bucketId, ID.unique(), file);
    } catch (error) {
      console.log("Appwrite service :: uploadFile() :: ", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(conf.bucketId, fileId);
    } catch (error) {
      console.log("Appwrite service :: deleteFile() :: ", error);
      return false;
    }
  }

   getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.bucketId, fileId);
  }
}

const profileService = new Service();
export default profileService;
