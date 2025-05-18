import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance with interceptors for auth
const api = axios.create();

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
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

export default function MentorProfile() {
  const { user, setuser } = useAuth();
  const actualUser = user?.user;

  const [mentorForm, setMentorForm] = useState({
    name: '',
    title: '',
    bio: '',
    categories: '',
    credentials: '',
    experience: '',
    price: '',
    linkedin: '',
    availableDates: [],
  });

  const [menteeForm, setMenteeForm] = useState({
    name: '',
    bio: '',
    interests: '',
    currentLevel: '',
    goals: '',
    avatar: '',
    linkedin: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actualUser?.role === 'mentor') {
      // Fetch existing mentor profile
      setLoading(true);
      api.get(`/api/mentors/${actualUser.id}`)
        .then((res) => {
          if (res.data.success) {
            const mentorData = res.data.data;
            setMentorForm({
              name: mentorData.name || '',
              title: mentorData.title || '',
              bio: mentorData.bio || '',
              categories: Array.isArray(mentorData.categories) 
                ? mentorData.categories.join(', ') 
                : '',
              credentials: Array.isArray(mentorData.credentials) 
                ? mentorData.credentials.join(', ') 
                : '',
              experience: mentorData.experience || '',
              price: mentorData.price || '',
              linkedin: mentorData.linkedin || '',
              availableDates: mentorData.availableDates || [],
            });
          }
        })
        .catch((err) => {
          if (err.response?.status !== 404) {
            console.error('Failed to fetch mentor profile:', err);
            setMessage('Error loading existing profile. Starting fresh.');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (actualUser?.role === 'mentee') {
      // Fetch existing mentee profile from user data
      setLoading(true);
      api.get('/api/users/me')
        .then((res) => {
          const userData = res.data;
          setMenteeForm({
            name: userData.name || '',
            bio: userData.bio || '',
            interests: userData.interests ? userData.interests.join(', ') : '',
            currentLevel: userData.currentLevel || '',
            goals: userData.goals || '',
            avatar: userData.avatar || '',
            linkedin: userData.linkedin || '',
          });
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err);
          setMessage('Error loading existing profile. Starting fresh.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [actualUser]);

  const handleMentorChange = (e) => {
    const { name, value } = e.target;
    setMentorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenteeChange = (e) => {
    const { name, value } = e.target;
    setMenteeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitMentee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Prepare data for submission
      const formData = {
        name: menteeForm.name,
        bio: menteeForm.bio,
        avatar: menteeForm.avatar,
        linkedin: menteeForm.linkedin,
        interests: menteeForm.interests
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        currentLevel: menteeForm.currentLevel,
        goals: menteeForm.goals,
      };

      // Submit to user profile endpoint
      const response = await api.put('/api/users/me', formData);

      setMessage('Profile saved successfully!');
      
      // Update the user context with new data
      const updatedUser = await api.get('/api/users/me');
      setuser((prev) => ({ ...prev, user: updatedUser.data }));

    } catch (err) {
      console.error('Error saving mentee profile:', err);
      if (err.response?.status === 401) {
        setMessage('Authentication failed. Please log in again.');
      } else {
        setMessage(
          err.response?.data?.message || 
          'Error saving mentee profile. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMentor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Prepare data for submission
      const formData = {
        ...mentorForm,
        categories: mentorForm.categories
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        credentials: mentorForm.credentials
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        experience: Number(mentorForm.experience) || 0,
        price: Number(mentorForm.price) || 0,
      };

      // Submit to the single profile endpoint
      const response = await api.post('/api/mentors/profile', formData);

      if (response.data.success) {
        setMessage(response.data.message || 'Profile saved successfully!');
        
        // Optionally refresh user data
        try {
          const updatedUser = await api.get(`/api/users/${actualUser.id}`);
          setuser((prev) => ({ ...prev, user: updatedUser.data }));
        } catch (userFetchError) {
          console.warn('Could not refresh user data:', userFetchError);
        }
      }
    } catch (err) {
      console.error('Error saving mentor profile:', err);
      setMessage(
        err.response?.data?.error || 
        'Error saving mentor profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const generateNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const handleDateClick = (date) => {
    setMentorForm((prev) => {
      const dates = prev.availableDates.includes(date)
        ? prev.availableDates.filter((d) => d !== date)
        : [...prev.availableDates, date];
      return { ...prev, availableDates: dates };
    });
  };

  if (!actualUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-500">Unauthorized. Please log in.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">
          {actualUser.role === 'mentor' ? 'Mentor Profile Setup' : 'Mentee Profile Setup'}
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

        {actualUser.role === 'mentor' ? (
          <form onSubmit={handleSubmitMentor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                name="name"
                value={mentorForm.name}
                onChange={handleMentorChange}
                placeholder="Enter your full name"
                required
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Professional Title *
              </label>
              <input
                name="title"
                value={mentorForm.title}
                onChange={handleMentorChange}
                placeholder="e.g., Senior Software Engineer, Tech Lead"
                required
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Bio *
              </label>
              <textarea
                name="bio"
                value={mentorForm.bio}
                onChange={handleMentorChange}
                placeholder="Tell potential mentees about yourself..."
                required
                rows={4}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Categories (comma-separated)
              </label>
              <input
                name="categories"
                value={mentorForm.categories}
                onChange={handleMentorChange}
                placeholder="e.g., Software Development, Data Science, Product Management"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Credentials (comma-separated)
              </label>
              <input
                name="credentials"
                value={mentorForm.credentials}
                onChange={handleMentorChange}
                placeholder="e.g., M.S. Computer Science, AWS Certified, Google Cloud Professional"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Experience (years)
              </label>
              <input
                name="experience"
                type="number"
                value={mentorForm.experience}
                onChange={handleMentorChange}
                placeholder="Years of professional experience"
                min="0"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Price per Session (INR)
              </label>
              <input
                name="price"
                type="number"
                value={mentorForm.price}
                onChange={handleMentorChange}
                placeholder="Session fee in Indian Rupees"
                min="0"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                LinkedIn Profile
              </label>
              <input
                name="linkedin"
                type="url"
                value={mentorForm.linkedin}
                onChange={handleMentorChange}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Available Dates (Next 7 Days)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {generateNext7Days().map((dateStr) => {
                  const isSelected = mentorForm.availableDates.includes(dateStr);
                  const dateObj = new Date(dateStr);
                  const displayDate = dateObj.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => handleDateClick(dateStr)}
                      className={`px-3 py-2 rounded text-sm border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {displayDate}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        ) : (
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
                Interests (comma-separated)
              </label>
              <input
                name="interests"
                value={menteeForm.interests}
                onChange={handleMenteeChange}
                placeholder="e.g., Web Development, Data Science, Product Management, Career Growth"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Current Level
              </label>
              <select
                name="currentLevel"
                value={menteeForm.currentLevel}
                onChange={handleMenteeChange}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="">Select your current level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="student">Student</option>
                <option value="recent-grad">Recent Graduate</option>
                <option value="career-change">Career Changer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Goals
              </label>
              <textarea
                name="goals"
                value={menteeForm.goals}
                onChange={handleMenteeChange}
                placeholder="What are you hoping to achieve through mentorship? e.g., Learn new skills, advance career, start a business..."
                rows={3}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                LinkedIn Profile
              </label>
              <input
                name="linkedin"
                type="url"
                value={menteeForm.linkedin}
                onChange={handleMenteeChange}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}