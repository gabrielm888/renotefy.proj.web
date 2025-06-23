import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies, authorization headers with HTTPS
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get the auth token from Firebase
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        const token = await getIdToken(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
        // Don't block the request if token refresh fails
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          // Force token refresh
          const token = await getIdToken(user, true);
          
          if (token) {
            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            // Retry the original request with the new token
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Redirect to login or handle token refresh failure
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?sessionExpired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

/**
 * API service for authentication
 */
export const authService = {
  // Login with email and password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Send password reset email
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
  
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
  
  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

/**
 * API service for notes
 */
export const notesService = {
  // Get all notes
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },
  
  // Get a single note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },
  
  // Create a new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  
  // Update a note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  
  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
  
  // Share a note with another user
  shareNote: async (id, userId, permission = 'view') => {
    const response = await api.post(`/notes/${id}/share`, { userId, permission });
    return response.data;
  },
  
  // Get shared notes
  getSharedNotes: async () => {
    const response = await api.get('/notes/shared');
    return response.data;
  },
};

/**
 * API service for user management
 */
export const usersService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  // Get a single user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  // Update a user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  // Delete a user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;
