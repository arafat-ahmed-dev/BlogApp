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
    profileImage,
    email,
    userId,
    Country,
  }) {
    console.log(profileName,bio,profileImage,email,userId,Country)
    try {
      return await this.databases.createDocument(
        conf.databaseId,
        conf.profileCollectionId,
        userId,
        {
          profileName,
          bio,
          profileImage,
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
    { profileName, bio, email, profileImage, Country }
  ) {
    try {
      return await this.databases.updateDocument(
        conf.databaseId,
        conf.profileCollectionId,
        userId,
        {
          profileName,
          bio,
          email,
          profileImage,
          Country,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateProfile() :: ", error);
      return false;
    }
  }
  
  async uploadFile(file, userId) {
    try {
      return await this.bucket.createFile(conf.bucketId, userId, file);
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
