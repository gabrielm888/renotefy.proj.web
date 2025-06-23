import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { classNames } from '../utils/classNames';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';

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
      // Double check if we need to set local error
      if (!authError) {
        setLocalError('Failed to log in. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(''); // Clear any previous auth errors
    
    try {
      // Start Google login flow - may use popup or redirect
      console.log('Starting Google sign-in flow');
      setLoading(true);
      
      const user = await loginWithGoogle();
      console.log('Google login response:', user ? 'Success' : 'Redirect in progress');
      
      // If we get a user back, it means the popup worked
      // and we can navigate. Otherwise, the redirect is happening
      // and the page will reload.
      if (user) {
        console.log('Google login successful via popup, redirecting to dashboard');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setLocalError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Background accents with glow effects */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-indigo-500/20 rounded-full filter blur-3xl animate-float"></div>
      
      <motion.div 
        className="w-full max-w-md p-8 rounded-xl shadow-glass bg-gray-900/30 backdrop-blur-xl border border-white/10 relative z-10 overflow-hidden"
        variants={slideUp}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent pointer-events-none"></div>
        
        <motion.div className="text-center mb-6" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1"
            variants={fadeIn}
          >
            Renotefy
          </motion.h1>
          <motion.p className="text-gray-200 mt-2" variants={fadeIn}>Sign in to your account</motion.p>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <motion.div className="mb-5" variants={fadeIn}>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full rounded-xl bg-gray-800/50 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-inner outline-none" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.div className="mb-6" variants={fadeIn}>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input 
              type="password" 
              id="password" 
              className="w-full rounded-xl bg-gray-800/50 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-inner outline-none" 
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            disabled={loading}
            className={classNames(
              "w-full relative overflow-hidden text-white font-medium py-3.5 px-4 rounded-xl flex justify-center items-center mb-4",
              "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-70",
              "shadow-glow-primary transition-all duration-300"
            )}
            variants={fadeIn}
            animate={{ 
              boxShadow: loading 
                ? "0 0 0 rgba(59, 130, 246, 0)" 
                : ["0 0 0 rgba(59, 130, 246, 0)", "0 0 24px rgba(59, 130, 246, 0.6)", "0 0 0 rgba(59, 130, 246, 0)"] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 15px 25px -5px rgba(59, 130, 246, 0.6)",
              transition: { duration: 0.2, ease: "easeOut" } 
            }}
            whileTap={{ 
              scale: 0.97,
              boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.5)"
            }}
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
        
        <motion.div 
          className="relative flex py-5 items-center w-full"
          variants={fadeIn}
        >
          <div className="flex items-center justify-center w-full">
            <div className="flex-grow border-t border-gray-700/50"></div>
            <span className="mx-4 text-gray-400 text-sm font-medium">or</span>
            <div className="flex-grow border-t border-gray-700/50"></div>
          </div>
        </motion.div>

        <motion.button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-3.5 px-4 border border-white/20 rounded-xl shadow-glass bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-all font-medium text-white"
          title="Sign in with your Google account"
          variants={fadeIn}
          whileHover={{ 
            scale: 1.02, 
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
          }}
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
              <li>Add <code className="bg-amber-500/30 px-1 rounded">{window.location.hostname}</code> to the list</li>
            </ol>
          </div>
        )}
        
        {error && error.includes('account-exists-with-different-credential') && (
          <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/30 text-amber-200 rounded-xl text-sm backdrop-blur-sm">
            <p className="font-bold">Account Already Exists:</p>
            <p>An account with this email already exists using a different sign-in method.</p>
            <p className="mt-2">Try logging in with the method you used when you first created your account.</p>
          </div>
        )}
        
        <motion.p 
          className="mt-8 text-center text-sm text-gray-300"
          variants={fadeIn}
        >
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
          >
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
