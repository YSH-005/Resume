import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';
import MentorProfile from '../pages/MentorProfile';
import ResumePage from '../pages/ResumePage';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from './ProtectedRoute';
import MentorSearch from '../pages/MentorSearch';
import BookingDashboard from '../pages/BookingDashboard';
import Feed from '../components/feed/Feed';
import MenteeProfile from '../pages/MenteeProfile';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();
  const ActualUser = user?.user;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {ActualUser?.role === "mentor" ? <MentorProfile /> : <MenteeProfile />}
          </ProtectedRoute>
        }
      />
      <Route 
        path="/mentors" 
        element={
          <ProtectedRoute>
            <MentorSearch />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resume" 
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            <BookingDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;