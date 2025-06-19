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
      className="min-h-screen flex items-center justify-center bg-white dark:bg-dark py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Renotefy</h2>
          <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-500 dark:from-gray-400 dark:to-gray-300 font-medium">Create your account</p>
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
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-dark-light dark:text-white"
            />
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span className="opacity-0">Create Account</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-dark">
              Or continue with
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-light"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5 mr-2" 
          />
          Google
        </button>
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
