import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, firestore } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register a new user with email and password
  const register = async (email, password, fullName, username) => {
    try {
      setError('');
      console.log('Starting registration process for:', email);
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Firebase Auth:', user.uid);

      // Update profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
      console.log('User profile updated with displayName:', fullName);

      try {
        // Store additional user data in Firestore
        const userData = {
          uid: user.uid,
          email,
          fullName,
          username,
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || '',
        };
        
        console.log('Creating user document in Firestore:', userData);
        await setDoc(doc(firestore, 'users', user.uid), userData);
        console.log('Firestore document created successfully');
      } catch (firestoreError) {
        console.error('Error creating Firestore document:', firestoreError);
        // Even if saving to Firestore fails, we still want to return the authenticated user
        // This way, the user can still access the app, even if some features might be limited
      }

      return user;
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password accounts are not enabled. Please contact support.');
      } else {
        setError(err.message || 'Failed to register');
      }
      throw err;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError('');
      console.log('Attempting login for:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Login successful for user:', user.uid);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to login';
      
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please register first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else {
        errorMessage = err.message || 'Failed to login';
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      // Configure Google provider for better user experience
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      // Configure Google provider to request additional scopes
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google auth successful:', user);

      try {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        
        // If user doesn't exist, create a new document
        if (!userDoc.exists()) {
          // Extract username from email, ensure it's unique
          const baseUsername = user.email.split('@')[0];
          const uniqueUsername = `${baseUsername}_${Date.now().toString().slice(-4)}`;
          
          const userData = {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || '',
            username: uniqueUsername,
            createdAt: new Date().toISOString(),
            photoURL: user.photoURL || '',
          };
          
          console.log('Creating new user document with unique username:', userData);
          
          await setDoc(doc(firestore, 'users', user.uid), userData);
        } else {
          console.log('User document already exists');
        }
      } catch (firestoreError) {
        console.error('Error with Firestore during Google auth:', firestoreError);
        // Continue even if Firestore operations fail
      }
      
      return user;
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials. Please sign in using a different method.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('The sign-in process was cancelled. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in. Please add localhost to your Firebase authorized domains list.');
        console.error('IMPORTANT: You need to add localhost to your Firebase console authorized domains!');
      } else {
        setError(err.message || 'Failed to login with Google');
      }
      throw err;
    }
  };

  // Logout current user
  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
      
      if (user) {
        console.log('Auth state changed: User is authenticated', user.uid);
        try {
          // Check if user exists in Firestore
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          let userData = {};
          
          if (docSnap.exists()) {
            // User document exists, use the data
            console.log('Firestore document exists for user');
            userData = docSnap.data();
          } else {
            // User document doesn't exist, create a basic one
            console.log('No Firestore document found, creating basic profile');
            
            userData = {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || '',
              // Create a unique username with a timestamp to avoid conflicts
              username: `${user.email.split('@')[0]}_${Date.now().toString().slice(-4)}`,
              createdAt: new Date().toISOString(),
              photoURL: user.photoURL || '',
            };
            
            try {
              await setDoc(docRef, userData);
              console.log('Basic profile created successfully');
            } catch (firestoreErr) {
              console.error('Failed to create basic profile:', firestoreErr);
              // Continue even if we can't create a Firestore document
            }
          }
          
          // Combine Firebase auth user with Firestore data
          const enhancedUser = { ...user, ...userData };
          setCurrentUser(enhancedUser);
          console.log('Current user set with combined data');
        } catch (err) {
          console.error('Error fetching user data from Firestore:', err);
          // Still set the authenticated user even if Firestore access fails
          // Add basic fields that the app might expect
          const basicUser = {
            ...user,
            username: user.email ? user.email.split('@')[0] : 'user',
            fullName: user.displayName || 'User'
          };
          setCurrentUser(basicUser);
          console.log('Set user with just auth data due to Firestore error');
        }
      } else {
        console.log('Auth state changed: No user is authenticated');
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout,
    error,
    setError, // Export setError to allow components to clear/set errors
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
