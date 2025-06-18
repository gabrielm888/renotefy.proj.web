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
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with full name
      await updateProfile(user, {
        displayName: fullName
      });

      // Store additional user data in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email,
        fullName,
        username,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || '',
      });

      return user;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError('');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      
      // If user doesn't exist, create a new document
      if (!userDoc.exists()) {
        // Extract username from email
        const username = user.email.split('@')[0];
        
        await setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || '',
          username,
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || '',
        });
      }
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      throw err;
    }
  };

  // Logout current user
  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Combine Firebase auth user with Firestore data
          setCurrentUser({
            ...user,
            fullName: userData.fullName,
            username: userData.username,
          });
        } else {
          setCurrentUser(user);
        }
      } else {
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
