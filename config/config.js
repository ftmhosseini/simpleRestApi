// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmoNbUwYdzIW3COX7t98ERyHOVFsINCh0",
  authDomain: "myfirstsimplerestapi.firebaseapp.com",
  databaseURL: "https://myfirstsimplerestapi-default-rtdb.firebaseio.com",
  projectId: "myfirstsimplerestapi",
  storageBucket: "myfirstsimplerestapi.firebasestorage.app",
  messagingSenderId: "784680629143",
  appId: "1:784680629143:web:754559bb4c475f5d884ad2",
  measurementId: "G-PRE1G4ZNF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
// const analytics = getAnalytics(app);