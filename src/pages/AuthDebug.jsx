import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebase';

const AuthDebug = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [debugOutput, setDebugOutput] = useState('Debug info will appear here');
  const [loading, setLoading] = useState(false);

  const { currentUser, register, login, loginWithGoogle } = useAuth();
  const auth = getAuth();

  // Debug information about current auth state
  const showAuthState = () => {
    setDebugOutput(
      `Current User: ${currentUser ? JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        username: currentUser.username || 'N/A',
        fullName: currentUser.fullName || 'N/A'
      }, null, 2) : 'No user authenticated'}`
    );
  };

  // Test direct Firebase authentication
  const testDirectAuth = async () => {
    setLoading(true);
    setDebugOutput('Testing direct Firebase auth...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setDebugOutput(`Direct Firebase Auth Success: ${JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }, null, 2)}`);
    } catch (error) {
      setDebugOutput(`Direct Firebase Auth Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test creating a user directly with Firebase
  const testDirectRegister = async () => {
    setLoading(true);
    setDebugOutput('Testing direct Firebase registration...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add user to firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email,
        fullName: fullName || 'Test User',
        username: username || email.split('@')[0],
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || '',
      });
      
      setDebugOutput(`Direct Registration Success: ${JSON.stringify({
        uid: user.uid,
        email: user.email,
        userDoc: 'Created in Firestore'
      }, null, 2)}`);
    } catch (error) {
      setDebugOutput(`Direct Registration Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test the context registration function
  const testContextRegister = async () => {
    setLoading(true);
    setDebugOutput('Testing context registration...');
    try {
      const user = await register(email, password, fullName || 'Test User', username || email.split('@')[0]);
      setDebugOutput(`Context Registration Success: ${JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }, null, 2)}`);
    } catch (error) {
      setDebugOutput(`Context Registration Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test the context login function
  const testContextLogin = async () => {
    setLoading(true);
    setDebugOutput('Testing context login...');
    try {
      const user = await login(email, password);
      setDebugOutput(`Context Login Success: ${JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }, null, 2)}`);
    } catch (error) {
      setDebugOutput(`Context Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test Google login
  const testGoogleLogin = async () => {
    setLoading(true);
    setDebugOutput('Testing Google login...');
    try {
      const user = await loginWithGoogle();
      setDebugOutput(`Google Login Success: ${JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }, null, 2)}`);
    } catch (error) {
      setDebugOutput(`Google Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check Firestore user document
  const checkFirestoreUser = async () => {
    if (!currentUser) {
      setDebugOutput('No user authenticated to check in Firestore');
      return;
    }

    setLoading(true);
    setDebugOutput(`Checking Firestore for user ${currentUser.uid}...`);
    try {
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setDebugOutput(`Firestore user found: ${JSON.stringify(userDoc.data(), null, 2)}`);
      } else {
        setDebugOutput(`No Firestore document for user ${currentUser.uid}`);
      }
    } catch (error) {
      setDebugOutput(`Firestore Check Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-white dark:bg-dark p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glassmorphism rounded-xl max-w-3xl w-full mx-4 p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Authentication Debug Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Full Name (for registration)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Username (for registration)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={showAuthState}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={loading}
            >
              Show Auth State
            </button>
            <button 
              onClick={testDirectAuth}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              disabled={loading || !email || !password}
            >
              Test Direct Firebase Auth
            </button>
            <button 
              onClick={testDirectRegister}
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
              disabled={loading || !email || !password}
            >
              Test Direct Firebase Registration
            </button>
            <button 
              onClick={testContextRegister}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              disabled={loading || !email || !password}
            >
              Test Context Registration
            </button>
            <button 
              onClick={testContextLogin}
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
              disabled={loading || !email || !password}
            >
              Test Context Login
            </button>
            <button 
              onClick={testGoogleLogin}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              disabled={loading}
            >
              Test Google Login
            </button>
            <button 
              onClick={checkFirestoreUser}
              className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
              disabled={loading || !currentUser}
            >
              Check Firestore User
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Debug Output:</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-60 text-sm">
            {debugOutput}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthDebug;
