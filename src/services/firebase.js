// Firebase configuration for Renotify
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration provided in the requirements
const firebaseConfig = {
  apiKey: "AIzaSyDtn4cyumqwwlmjV2wiVj3MfI1t2sG8Lkw",
  authDomain: "re-notefy-539da.firebaseapp.com",
  databaseURL: "https://re-notefy-539da-default-rtdb.firebaseio.com",
  projectId: "re-notefy-539da",
  storageBucket: "re-notefy-539da.appspot.com",
  messagingSenderId: "914474493268",
  appId: "1:914474493268:web:77b9dd56ef7b875876d4c1",
  measurementId: "G-9837DEYRQQ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, firestore, database, storage, googleProvider };
