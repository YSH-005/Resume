import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-white">
        MentorConnect
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link to="/mentors" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 flex items-center gap-1">
          <Search size={16} /> Find Mentors
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Dashboard</Link>
            {user.role === 'mentee' && (
              <>
                <Link to="/resume" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Resume</Link>
                <Link to="/bookings" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Bookings</Link>
              </>
            )}
            {user.role === 'mentor' && (
              <Link to="/feed" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Posts</Link>
            )}
            <Link to="/chat" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Chat</Link>
            <Link to="/profile" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300">Profile</Link>
            <button onClick={handleLogout} className="ml-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition">
              Logout
            </button>
          </>
        )}

        <button onClick={() => setDarkMode(!darkMode)} className="ml-2">
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>
    </nav>
  );
}
