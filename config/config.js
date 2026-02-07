// Import the functions you need from the SDKs you need
/**
 * Firebase Configuration & Initialization
 * This file sets up the connection to the Firebase Realtime Database
 * using environment variables for security.
 */
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';
// Load environment variables from the .env file into process.env
dotenv.config();

/**
 * Firebase Project Credentials
 * Extracted from environment variables to prevent leaking sensitive 
 * information in the source code.
 */
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize the Firebase Application instance
const app = initializeApp(firebaseConfig);

/**
 * Exported Database Instance
 * This 'db' constant is imported by controllers to perform CRUD operations.
 */
export const db = getDatabase(app)
