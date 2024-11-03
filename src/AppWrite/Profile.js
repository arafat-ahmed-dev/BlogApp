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
    image
  }) {
    try {
      return await this.databases.createDocument(
        conf.databaseId,
        conf.profileCollectionId,
        ID.unique(),
        {
          image
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createPost() :: ", error);
      return false;
    }
  }

  async updatePost(slug, { title, content, featuredImage, postStatus }) {
    try {
      return await this.databases.updateDocument(
        conf.databaseId,
        conf.profileCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          postStatus,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updateDocument() :: ", error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.databaseId,
        conf.profileCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteDocument() :: ", error);
      return false;
    }
  }

  // storage service

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
