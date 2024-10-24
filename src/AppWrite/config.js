// import { Client, ID, Databases, Storage, Query } from "appwrite";
// import conf from "../conf/conf.js";

// export class Service {
//   client = new Client();
//   databases;
//   bucket;
//   constructor() {
//     this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteId);
//     this.databases = new Databases(this.client);
//     this.bucket = new Storage(this.client);
//   }
//   async createPost({title, slug, content, postStatus, featuredImage, userId}){
//     try {
//         return await this.databases.createDocument(
//             conf.databaseId,
//             conf.collectionId,
//             slug,
//             {
//                 title, content, postStatus, userId, featuredImage
//             }
//         )
//     } catch (error) {
//         console.log("Appwrite service :: createPost() :: ", error);
//     }
// }

//   async updatePost(slug, { title, content, featuredImage, postStatus }) {
//     try {
//       return await this.databases.updateDocument(
//         conf.databaseId,
//         conf.collectionId,
//         slug,
//         {
//           title,
//           content,
//           featuredImage,
//           postStatus,
//         }
//       );
//     } catch (error) {
//       console.log("Appwrite serive :: updatePost :: error", error);
//     }
//   }

//   async deletePost(slug) {
//     try {
//       await this.databases.deleteDocument(
//         conf.databaseId,
//         conf.collectionId,
//         slug
//       );
//       return true;
//     } catch (error) {
//       console.log("Appwrite serive :: deletePost :: error", error);

//       return false;
//     }
//   }

//   async getPost(slug) {
//     try {
//       return await this.databases.getDocument(
//         conf.databaseId,
//         conf.collectionId,
//         slug
//       );
//     } catch (error) {
//       console.log("Appwrite serive :: getPost :: error", error);
//     }
//   }
//   //i want to those post which are active
//   async getPosts(){
//     try {
//         return await this.databases.listDocuments(
//             conf.databaseId,
//             conf.collectionId,
//             [Query.equal("postStatus", "active")],

//         )
//     } catch (error) {
//         console.log("Appwrite serive :: getPosts :: error", error);
//         return false
//     }
// }

// async uploadFile(file) {
//   try {
//       // Validate the bucketId
//       const { bucketId } = conf; // Assuming conf is where your configuration is stored

//       if (!this.isValidBucketId(bucketId)) {
//           throw new Error(`Invalid bucketId: ${bucketId}`);
//       }

//       await this.bucket.createFile(bucketId, ID.unique(), file);
//       return true;
//   } catch (error) {
//       console.log("Appwrite service :: uploadFile :: error", error);
//       return false;
//   }
// }

// // Function to validate the bucketId
// isValidBucketId(bucketId) {
//   const regex = /^[a-zA-Z0-9][a-zA-Z0-9_]{0,35}$/; // First char must be alphanumeric, max 36 chars
//   return regex.test(bucketId);
// }


//   async deleteFile(fileId) {
//     try {
//         await this.bucket.deleteFile(
//         conf.bucketId , 
//         fileId
//     )
//         return true
//     } catch (error) {
//       console.log("Appwrite service :: deleteFile :: error", error);
//       return false;
//     }
//   }

//   getFilePreview(fileId){
//     return this.bucket.getFilePreview(
//         conf.bucketId,
//         fileId
//     )
//   }
  
// }

// const service = new Service();
// export default service;



import conf from "../conf/conf"
import { Client, Databases, Storage, Query, ID } from "appwrite";


export class Service {
    client = new Client()
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.databaseId, conf.collectionId, slug)
        } catch (error) {
            console.log("Appwrite service :: getPost() :: ", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("postStatus", "active")] ){
        try {
            return await this.databases.listDocuments(conf.databaseId, conf.collectionId, queries)
        } catch (error) {
            console.log("Appwrite service :: getPosts() :: ", error);
            return false
        }
    }

    async createPost({title, content,slug, featuredImage, postStatus, userId}){
      console.log(userId);
      
        try {
            return await this.databases.createDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title, content, featuredImage, postStatus, userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost() :: ", error);
            return false
        }
    }

    async updatePost(slug, {title, content, featuredImage, postStatus}){
        try {
            return await this.databases.updateDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                {
                    title, content, featuredImage, postStatus
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateDocument() :: ", error);
            return false
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.databaseId,
                conf.collectionId,
                slug,
                )
            return true;    
        } catch (error) {
            console.log("Appwrite service :: deleteDocument() :: ", error);
            return false
        }
    }

    // storage service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.bucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile() :: ", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.bucketId,
                fileId
                
            )
        } catch (error) {
            console.log("Appwrite service :: deleteFile() :: ", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.bucketId,
            fileId
        )
    }
}


const service = new Service()
export default service;
