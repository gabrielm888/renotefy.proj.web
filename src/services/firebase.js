// Firebase configuration for Renotefy
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration from environment variables or fallback to values if not defined
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDtn4cyumqwwlmjV2wiVj3MfI1t2sG8Lkw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "re-notefy-539da.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://re-notefy-539da-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "re-notefy-539da",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "re-notefy-539da.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "914474493268",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:914474493268:web:77b9dd56ef7b875876d4c1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9837DEYRQQ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, firestore, database, storage, googleProvider };
