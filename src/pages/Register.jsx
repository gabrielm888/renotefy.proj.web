import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

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
    setLoading(true);
    
    try {
      console.log('Initiating Google registration/login');
      await loginWithGoogle();
      console.log('Google registration/login successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google registration/login error:', err);
      setError('Failed to register with Google: ' + (err.message || 'Google authentication was cancelled or failed'));
    } finally {
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-950 to-black dark:bg-dark py-8"
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
          <p className="text-gray-100 font-medium">Create your account</p>
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
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="John Smith"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="username123"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400"
              placeholder="••••••••••••"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          title="Sign up with your Google account"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img 
            src="/google-icon.svg" 
            alt="Google" 
            className="w-5 h-5 mr-3" 
          />
          Sign up with Google
        </motion.button>
        
        <p className="mt-8 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
