// Firebase configuration for Renotefy
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Get environment variables (works with both Vite and Vercel)
const env = typeof window !== 'undefined' ? 
  // Client-side
  (window.__ENV__ || process.env) : 
  // Server-side
  process.env;

// Required Firebase environment variables
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Firebase configuration with fallback for Vercel env vars
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check for missing required configuration in production
if (process.env.NODE_ENV === 'production') {
  const missingVars = Object.entries({
    apiKey: 'VITE_FIREBASE_API_KEY',
    authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
    projectId: 'VITE_FIREBASE_PROJECT_ID',
    appId: 'VITE_FIREBASE_APP_ID'
  }).filter(([key]) => !firebaseConfig[key]);

  if (missingVars.length > 0) {
    const errorMsg = `Missing required Firebase configuration: ${missingVars.map(([_, varName]) => varName).join(', ')}`;
    console.error('Firebase Config Error:', errorMsg);
    if (typeof window === 'undefined') {
      // Server-side error
      throw new Error(errorMsg);
    }
  }
}

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
