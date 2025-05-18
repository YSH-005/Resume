import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ClipboardList, MessageCircle, Calendar, Search, Megaphone } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const role = user.user?.role || 'mentee';

  const menteeFeatures = [
    { icon: Search, label: 'Search for mentors' },
    { icon: ClipboardList, label: 'Build and score your resume' },
    { icon: MessageCircle, label: 'Chat and schedule guidance calls' },
  ];

  const mentorFeatures = [
    { icon: Megaphone, label: 'Create posts to guide mentees' },
    { icon: Calendar, label: 'View your bookings and schedules' },
    { icon: MessageCircle, label: 'Chat with mentees in real time' },
  ];

  const features = role === 'mentee' ? menteeFeatures : mentorFeatures;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {/* Main content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            Welcome, {user.name}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, label }, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition"
              >
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <p className="text-gray-800 dark:text-gray-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Optional: Footer here if needed */}
      {/* <Footer /> */}
    </div>
  );
}

