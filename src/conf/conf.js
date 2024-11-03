const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appCollectionId: String(import.meta.env.VITE_APPWRITE_APP_COLLECTION_ID),
  profileCollectionId: String(import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID),
  bucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  apikey: String(import.meta.env.VITE_RTE_APIKEY_ID),
  redirectLink: String(import.meta.env.VITE_APP_REDIRECT_URL),
  googleCliendId: String(import.meta.env.VITE_GOOGLE_CLIENT_ID),
};

export default conf;
