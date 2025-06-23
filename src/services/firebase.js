// Firebase configuration for Renotefy
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Required Firebase environment variables
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

// Check for missing environment variables
const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  const errorMsg = `Missing required Firebase configuration: ${missingVars.join(', ')}`;
  console.error('Firebase Config Error:', errorMsg);
  
  // Only throw in production, allow development to continue with warnings
  if (import.meta.env.PROD) {
    throw new Error(errorMsg);
  } else {
    console.warn('Firebase configuration is incomplete. Some features may not work.');
  }
}

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log safe config info (without sensitive data)
console.log('[Firebase Config]', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  isConfigured: !!firebaseConfig.apiKey,
  env: import.meta.env.MODE
});

// Initialize Firebase only if it hasn't been initialized already
let app;
let auth;
let firestore;
let database;
let storage;
let googleProvider;

try {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] Initialized new Firebase app');
  } else {
    app = apps[0];
    console.log('[Firebase] Using existing Firebase app');
  }

  // Initialize services
  auth = getAuth(app);
  firestore = getFirestore(app);
  database = getDatabase(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log('[Firebase] Services initialized successfully');
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
  throw error; // Re-throw to prevent silent failures
}

export { app, auth, firestore, database, storage, googleProvider };
