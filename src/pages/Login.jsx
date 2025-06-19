import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      console.log('Login successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error in component:', err);
      // The error message is already set in the AuthContext
      if (!error) {
        setError('Failed to log in. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await loginWithGoogle();
      console.log('Google login successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error in component:', err);
      setError(err.message || 'Failed to log in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-white dark:bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Renotefy</h2>
          <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-500 dark:from-gray-400 dark:to-gray-300 font-medium">Sign in to your account</p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 flex items-start"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>{error}</div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 relative"
          >
            {loading ? (
              <>
                <span className="opacity-0">Sign in</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : 'Sign in'}
          </button>
        </form>
        
        <div className="relative flex py-5 items-center w-full">
          <div className="flex items-center justify-center w-full">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
          title="Note: For Google login to work, add 'localhost' to Firebase authorized domains"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
        
        {error && error.includes('unauthorized-domain') && (
          <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 text-yellow-800 dark:text-yellow-200 rounded text-sm">
            <p className="font-bold">Domain Authorization Required:</p>
            <p>To enable Google login, you need to add "localhost" to your Firebase project's authorized domains list:</p>
            <ol className="list-decimal list-inside mt-2 ml-2">
              <li>Go to the Firebase Console</li>
              <li>Select your project (re-notefy-539da)</li>
              <li>Navigate to Authentication → Settings → Authorized domains</li>
              <li>Add "localhost" to the list</li>
            </ol>
          </div>
        )}
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
