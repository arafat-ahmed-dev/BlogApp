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

  async getPosts() {
    try {
      const response = await this.databases.listDocuments(
        conf.databaseId,
        conf.appCollectionId
      );
      return response;
    } catch (error) {
      console.log("Appwrite service :: getPosts() :: ", error);
      return false;
    }
  }
  async createPost({ title, content, slug, featuredImage, postStatus, userId }) {
    try {
      const response = await this.databases.createDocument(
        conf.databaseId,
        conf.appCollectionId,
        ID.unique(),
        {
          title,
          content,
          featuredImage,
          postStatus,
          userId,
          slug,
          likes: "0,0",
          likedBy: '[]',      // New: Track users who liked
          unlikedBy: '[]',    // New: Track users who unliked
          comments: '[]',
        }
      );
      return response;
    } catch (error) {
      console.error("Appwrite service :: createPost() :: ", error);
      return false;
    }
  }

  async deletePost(postId) {
    try {
      await this.databases.deleteDocument(conf.databaseId, conf.appCollectionId, postId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost() :: ", error);
      return false;
    }
  }

  async updatePostLikes(postId, likeCount, unlikeCount, likedBy, unlikedBy) {
    try {
      const response = await this.databases.updateDocument(
        conf.databaseId,
        conf.appCollectionId,
        postId,
        {
          likes: `${likeCount},${unlikeCount}`,
          likedBy,      // Update likedBy list
          unlikedBy,    // Update unlikedBy list
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating post likes:", error);
      throw error;
    }
  }

  async updatePostComments(postId, comments) {
    try {
      const response = await this.databases.updateDocument(
        conf.databaseId,
        conf.appCollectionId,
        postId,
        {
          comments,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating post comments:", error);
      throw error;
    }
  }

  // Storage service
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
      await this.bucket.deleteFile(conf.bucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile() :: ", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    try {
      return this.bucket.getFilePreview(conf.bucketId, fileId);
    } catch (error) {
      console.error("Error getting file preview:", error);
      return null;
    }
  }
}

const service = new Service();
export default service;
