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
import { ThemeProvider, useTheme } from './providers/ThemeProvider';

// UI Components
import Button from './components/ui/Button';
import Card from './components/ui/Card';

// Styles
import './styles/animations.css';

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
const NotFound = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-dark-900 dark:to-dark-800">
      <Card className="max-w-md mx-4 text-center p-8">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => window.history.back()}
            variant="secondary"
            className="flex-1 sm:flex-none"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 sm:flex-none"
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Animation wrapper for routes
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait" initial={false}>
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
      <AuthProvider>
        <ThemeProvider>
          <NotesProvider>
            <div className="min-h-screen bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
              <AnimatedRoutes />
            </div>
          </NotesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
