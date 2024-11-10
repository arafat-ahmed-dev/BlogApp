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

  async createPost({
    title,
    content,
    slug,
    featuredImage,
    postStatus,
    userId,
  }) {
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
          likes: 0, // Initialize likes count
          comments: [], // Initialize empty comments array
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log("Appwrite service :: createPost() :: ", error);
      return false;
    }
  }

  async updatePost(slug, { title, content, featuredImage, postStatus }) {
    try {
      // Ensure 'content' is a valid string and truncate it to 1000 characters if needed
      if (content && content.length > 1000) {
        content = content.substring(0, 1000); // Truncate content to 1000 characters
      }

      // Proceed with updating the document
      return await this.databases.updateDocument(
        conf.databaseId,
        conf.appCollectionId,
        slug, // Assuming slug is the documentId
        {
          title,
          content, // Updated content
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
        conf.appCollectionId,
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
      await this.bucket.deleteFile(conf.bucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile() :: ", error);
      return false;
    }
  }

  async updatePostLikes(postId, likes) {
    try {
      const response = await this.databases.updateDocument(
        conf.databaseId,
        conf.appCollectionId,
        postId,
        {
          likes,
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
