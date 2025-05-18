import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance with interceptors for auth
const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your backend port
});

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized error detected');
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default function MenteeProfile() {
  // Get auth context - destructure carefully based on your actual context structure
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Simplified mentee form that matches your DB schema
  const [menteeForm, setMenteeForm] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: ''
  });

  // Extract user data and update function safely
  const user = auth?.user;
  // Check if setuser exists and is a function before using it
  const updateUser = typeof auth?.setuser === 'function' ? auth.setuser : null;

  // Load user data on component mount
  useEffect(() => {
    console.log('ProfileSetup mounted, checking auth state');
    console.log('Current auth context:', auth);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found in localStorage');
      setMessage('Please log in to access your profile.');
      setIsLoading(false);
      return;
    }

    // Try to fetch the current user data
    console.log('Token found, fetching user data');
    api.get('/api/users/me')
      .then(response => {
        const userData = response.data;
        console.log('Fetched user data:', userData);
        
        // Update the form with existing data
        setMenteeForm({
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          bio: userData.bio || ''
        });
        
        // Only update the user context if updateUser is a function
        if (updateUser) {
          try {
            updateUser({ user: userData });
            console.log('Updated user in context');
          } catch (err) {
            console.error('Failed to update user in context:', err);
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch user data:', error);
        setMessage('Error loading your profile data. Please try again later.');
        
        // If we get a 401, clear auth state
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleMenteeChange = (e) => {
    const { name, value } = e.target;
    setMenteeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMentee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Only send the fields that exist in your DB schema
      const formData = {
        name: menteeForm.name,
        avatar: menteeForm.avatar,
        bio: menteeForm.bio
      };

      console.log('Updating profile with data:', formData);

      // Update user profile
      const response = await api.put('/api/users/me', formData);
      console.log('Profile update response:', response.data);
      
      // Show success message
      setMessage('Profile updated successfully!');
      
      // Update user data in the form
      const updatedUserRes = await api.get('/api/users/me');
      const updatedUser = updatedUserRes.data;
      console.log('Updated user data:', updatedUser);
      
      // Update the form with the new data
      setMenteeForm({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        avatar: updatedUser.avatar || '',
        bio: updatedUser.bio || ''
      });
      
      // Only update the user context if updateUser is a function
      if (updateUser) {
        try {
          updateUser({ user: updatedUser });
          console.log('Updated user in context after profile update');
        } catch (err) {
          console.error('Failed to update user in context after profile update:', err);
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage(err.response?.data?.message || 'Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <p className="text-center text-gray-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If no auth data is found
  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <p className="text-center text-red-500">Please log in to access your profile.</p>
          <div className="mt-4 text-center">
            <a 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">
          Profile Setup
        </h2>

        {message && (
          <div className={`p-3 mb-4 rounded ${
            message.includes('Error') || message.includes('error')
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitMentee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              name="name"
              value={menteeForm.name}
              onChange={handleMenteeChange}
              placeholder="Enter your full name"
              required
              className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              name="email"
              value={menteeForm.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 dark:bg-slate-700 dark:border-slate-600 text-gray-500 dark:text-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={menteeForm.bio}
              onChange={handleMenteeChange}
              placeholder="Tell us about yourself, your background, and what you're looking for in a mentor..."
              rows={4}
              className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Profile Picture URL
            </label>
            <input
              name="avatar"
              type="url"
              value={menteeForm.avatar}
              onChange={handleMenteeChange}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}