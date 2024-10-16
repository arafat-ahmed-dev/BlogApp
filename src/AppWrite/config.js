import { Client, Account, ID, Databases, Storage, Query, Flag } from "appwrite";
import conf from "../conf.js";

export class Service {
  client = new Client();
  databases;
  bucket;
  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userID }) {
    try {
      return await this.databases.createDocument(
        conf.databaseId,
        conf.collectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userID,
        }
      );
    } catch (error) {
      throw error;
    }
  }
  async updateDocument(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.databaseId,
        conf.collectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteDocument(slug) {
    try {
      await this.databases.deleteDocument(
        conf.databaseId,
        conf.collectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("error", error);

      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.databaseId,
        conf.collectionId,
        slug
      );
    } catch (error) {
      throw error;
    }
  }
  //i want to those post which are active
  async getPosts(query = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.databaseId,
        conf.collectionId,
        query
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
    }
  }

  async uploadFile(file) {
    try {
       await this.bucket.createFile(conf.bucketId, ID.unique(), file);
       return true
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
        await this.bucket.deleteFile(
        conf.bucketId , 
        fileId
    )
        return true
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId){
    return this.bucket.getFilePreview(
        conf.bucketId,
        fileId
    )
  }
  
}

const service = new Service();
export default service;
