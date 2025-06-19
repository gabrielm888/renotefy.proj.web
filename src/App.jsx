import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import StudyMode from './pages/StudyMode';
import AuthDebug from './pages/AuthDebug';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Show nothing while checking auth status
  if (loading) {
    return null;
  }
  
  if (!currentUser) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// NotFound page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
);

// Animation wrapper for routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-debug" element={<AuthDebug />} />
        
        {/* Protected routes */}
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/editor/:noteId" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
        
        <Route path="/study/:noteId" element={
          <ProtectedRoute>
            <StudyMode />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotesProvider>
            <AnimatedRoutes />
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
