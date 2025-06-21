import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState('');
  
  const { login, loginWithGoogle, error: authError, setError: setAuthError } = useAuth();
  
  // Use authentication error from context if available
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(''); // Clear any previous auth errors
    setLoading(true);
    
    // Simple validation
    if (!email || !password) {
      setLocalError('Please fill in all fields');
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
  
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(''); // Clear any previous auth errors
    setLoading(true);
    
    try {
      // Start the Google login redirect flow
      console.log('Starting Google sign-in redirect flow');
      await loginWithGoogle();
      // No navigation or state changes here
      // The redirect will happen and the page will reload
    } catch (error) {
      console.error('Google login redirect error:', error);
      setLocalError(error.message || 'Failed to start Google login flow');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-950 to-black dark:bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background accents */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl"></div>
      
      <div className="relative bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/20 dark:border-gray-800/50">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 font-playfair">Renotefy</span>
          </h2>
          <p className="text-gray-100 font-medium">Sign in to your account</p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-4 flex items-start backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5 mr-2 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>{error}</div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-100">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="••••••••••••"
            />
          </div>
          
          <motion.button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          </motion.button>
        </form>
        
        <div className="relative flex py-5 items-center w-full">
          <div className="flex items-center justify-center w-full">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>
        </div>

        <motion.button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-white/30 rounded-xl shadow-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all font-medium text-white"
          title="Sign in with your Google account"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-3" />
          Sign in with Google
        </motion.button>
        
        {error && error.includes('unauthorized-domain') && (
          <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/30 text-amber-200 rounded-xl text-sm backdrop-blur-sm">
            <p className="font-bold">Domain Authorization Required:</p>
            <p>To enable Google login, you need to add your domain to Firebase authorized domains:</p>
            <ol className="list-decimal list-inside mt-2 ml-2">
              <li>Go to the Firebase Console</li>
              <li>Select your project (re-notefy-539da)</li>
              <li>Navigate to Authentication → Settings → Authorized domains</li>
              <li>Add your domain or "localhost" during development</li>
            </ol>
          </div>
        )}
        
        <p className="mt-8 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
