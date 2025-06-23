import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { classNames } from '../utils/classNames';
import { slideUp, fadeIn, staggerContainer } from '../utils/animations';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!fullName.trim()) {
      return setError('Please enter your full name');
    }
    
    if (!email.trim() || !email.includes('@')) {
      return setError('Please enter a valid email address');
    }
    
    if (!username.trim()) {
      return setError('Please enter a username');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('Submitting registration form for:', email);
      const user = await register(email, password, fullName, username);
      console.log('Registration successful, user created:', user.uid);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error in component:', err);
      // Handle specific Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check your email.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create account: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    
    try {
      console.log('Initiating Google registration/login');
      setLoading(true);
      
      const user = await loginWithGoogle();
      console.log('Google login response:', user ? 'Success' : 'Redirect in progress');
      
      // If we get a user back, it means the popup worked
      // and we can navigate. Otherwise, a redirect is happening
      if (user) {
        console.log('Google login successful via popup, redirecting to dashboard');
        navigate('/dashboard');
      }
      // If using redirect method, the page will refresh and handle auth state
    } catch (err) {
      console.error('Google registration/login error:', err);
      
      if (err.code === 'auth/unauthorized-domain') {
        setError(`This domain (${window.location.hostname}) is not authorized for Google sign-in. Please add it to Firebase authorized domains.`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled. Please try again.');
      } else {
        setError('Failed to register with Google: ' + (err.message || 'Unknown error'));
      }
      setLoading(false);
    }
  };
  
  // Generate username from email when email is entered
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!username && e.target.value.includes('@')) {
      setUsername(e.target.value.split('@')[0]);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Background accents with improved glow */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-pink-500/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl"></div>
      
      <motion.div 
        className="w-full max-w-md p-8 rounded-xl shadow-glass bg-gray-900/40 backdrop-blur-xl border border-white/10 relative z-10 overflow-hidden"
        variants={slideUp}
        initial="hidden"
        animate="visible"
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
          <motion.p className="text-gray-200 mt-2" variants={fadeIn}>Create your account</motion.p>
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
            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-200">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-sm outline-none" 
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </motion.div>
          
          <motion.div className="mb-5" variants={fadeIn}>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-sm outline-none" 
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </motion.div>
          
          <motion.div className="mb-5" variants={fadeIn}>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-200">Username</label>
            <input 
              type="text" 
              id="username" 
              className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-sm outline-none" 
              placeholder="username123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>
          
          <motion.div className="mb-5" variants={fadeIn}>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-sm outline-none" 
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
          
          <motion.div className="mb-6" variants={fadeIn}>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-200">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="w-full rounded-xl bg-gray-800/50 border border-gray-600/50 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-400 px-4 py-3 backdrop-blur-sm transition-all duration-200 shadow-sm outline-none" 
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            disabled={loading}
            className={classNames(
              "w-full relative overflow-hidden text-white font-medium py-3.5 px-4 rounded-xl flex justify-center items-center",
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
                <span className="opacity-0">Create Account</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : 'Create Account'}
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
          title="Sign up with your Google account"
          variants={fadeIn}
          whileHover={{ 
            scale: 1.02, 
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <img 
            src="/google-icon.svg" 
            alt="Google" 
            className="w-5 h-5 mr-3" 
          />
          Sign up with Google
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
        
        <motion.p 
          className="mt-8 text-center text-sm text-gray-300"
          variants={fadeIn}
        >
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
