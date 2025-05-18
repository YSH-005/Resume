import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ClipboardList, 
  MessageCircle, 
  Calendar, 
  Search, 
  Megaphone, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Code, 
  GraduationCap,
  Briefcase,
  Users,
  Clock,
  Star,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) navigate('/login');
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Format current time
    const now = new Date();
    setCurrentTime(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Update time every minute
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    }, 60000);
    
    return () => clearInterval(timer);
  }, [user, navigate]);

  if (!user) return null;

  const role = user.user?.role || 'mentee';
  const userName = user.name || user.user?.name || 'User';

  const menteeFeatures = [
    { 
      icon: Search, 
      label: 'Find Your Perfect Mentor', 
      description: 'Browse our curated list of industry experts ready to guide you',
      color: 'bg-blue-500',
      link: '/mentors'
    },
    { 
      icon: ClipboardList, 
      label: 'Resume Builder & Review', 
      description: 'Create and get professional feedback on your resume',
      color: 'bg-green-500',
      link: '/resume-builder'
    },
    { 
      icon: MessageCircle, 
      label: 'Guidance Sessions', 
      description: 'Schedule 1:1 calls with mentors for personalized advice',
      color: 'bg-purple-500',
      link: '/messages'
    },
    { 
      icon: BookOpen, 
      label: 'Learning Resources', 
      description: 'Access our library of courses, articles and guides',
      color: 'bg-amber-500',
      link: '/resources'
    },
    { 
      icon: Calendar, 
      label: 'Session Calendar', 
      description: 'View your upcoming mentor sessions and events',
      color: 'bg-rose-500',
      link: '/calendar'
    },
    { 
      icon: TrendingUp, 
      label: 'Career Pathway', 
      description: 'Map your career growth with personalized milestones',
      color: 'bg-teal-500',
      link: '/career-path'
    },
  ];

  const mentorFeatures = [
    { 
      icon: Megaphone, 
      label: 'Create Knowledge Posts', 
      description: 'Share your expertise through articles and advice',
      color: 'bg-indigo-500',
      link: '/create-post'
    },
    { 
      icon: Calendar, 
      label: 'Manage Schedule', 
      description: 'Set your availability and view upcoming sessions',
      color: 'bg-emerald-500',
      link: '/schedule'
    },
    { 
      icon: MessageCircle, 
      label: 'Mentee Conversations', 
      description: 'Chat with your mentees and provide guidance',
      color: 'bg-violet-500',
      link: '/messages'
    },
    { 
      icon: Users, 
      label: 'Mentee Network', 
      description: 'View and manage your current mentee relationships',
      color: 'bg-orange-500',
      link: '/mentees'
    },
    { 
      icon: GraduationCap, 
      label: 'Create Resources', 
      description: 'Build learning materials for your mentees',
      color: 'bg-pink-500',
      link: '/create-resource'
    },
    { 
      icon: TrendingUp, 
      label: 'Impact Analytics', 
      description: 'Track your mentoring impact and feedback',
      color: 'bg-cyan-500',
      link: '/analytics'
    },
  ];

  const features = role === 'mentee' ? menteeFeatures : mentorFeatures;
  
  // Dummy stats for UI purposes
  const stats = role === 'mentee' ? [
    { label: 'Sessions Completed', value: '12', icon: Clock, trend: '+3 this month' },
    { label: 'Mentors Following', value: '5', icon: Users, trend: '+2 new' },
    { label: 'Resume Score', value: '85%', icon: ClipboardList, trend: '+10% improvement' },
    { label: 'Learning Hours', value: '24', icon: BookOpen, trend: '+8 this week' },
  ] : [
    { label: 'Active Mentees', value: '18', icon: Users, trend: '+3 this month' },
    { label: 'Sessions Delivered', value: '47', icon: Clock, trend: '+12 this month' },
    { label: 'Avg. Rating', value: '4.9', icon: Star, trend: 'Top 5%' },
    { label: 'Resources Created', value: '16', icon: BookOpen, trend: '+3 new' },
  ];
  
  // Dummy notifications for UI
  const notifications = [
    { 
      title: role === 'mentee' ? 'New mentor match!' : 'New mentee request',
      time: '2 hours ago',
      read: false
    },
    { 
      title: 'Upcoming session reminder',
      time: 'Tomorrow, 3:00 PM',
      read: false
    },
    { 
      title: role === 'mentee' ? 'Your resume was reviewed' : 'Feedback received on your last session',
      time: 'Yesterday',
      read: true
    },
  ];
  
  // Dummy recommended content
  const recommendedContent = role === 'mentee' ? [
    { title: '10 Tips for Acing Your Technical Interview', type: 'Article' },
    { title: 'Building Your Personal Brand on LinkedIn', type: 'Webinar' },
    { title: 'Fundamentals of Project Management', type: 'Course' },
  ] : [
    { title: 'Effective Feedback Techniques for Mentors', type: 'Guide' },
    { title: 'Creating Engaging Learning Materials', type: 'Workshop' },
    { title: 'Measuring Mentoring Impact', type: 'Webinar' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">MentorMatch</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userName}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {greeting}, {userName}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{currentTime}</p>
          </div>
          
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-1 ${activeTab === 'overview' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`pb-3 px-1 ${activeTab === 'stats' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'}`}
              >
                Stats
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`pb-3 px-1 ${activeTab === 'notifications' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'}`}
              >
                Notifications
              </button>
            </div>
          </div>
          
          {activeTab === 'overview' && (
            <>
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.trend}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                        index % 4 === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        index % 4 === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Features */}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">What would you like to do today?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group cursor-pointer"
                    onClick={() => navigate(feature.link)}
                  >
                    <div className={`h-2 ${feature.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-lg bg-opacity-10 dark:bg-opacity-20 ${feature.color.replace('bg-', 'bg-opacity-10 text-')}`}>
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {feature.label}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recommended content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recommended for you</h3>
                <div className="space-y-4">
                  {recommendedContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{content.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{content.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-1 px-2 rounded-full">
                          New
                        </span>
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'stats' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Your Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress chart for UI purposes */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {role === 'mentee' ? 'Learning Progress' : 'Mentoring Hours'}
                  </h4>
                  <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end p-4">
                    {[35, 60, 45, 75, 50, 85, 70].map((height, i) => (
                      <div key={i} className="flex-1 mx-1">
                        <div 
                          className="bg-indigo-500 dark:bg-indigo-400 rounded-t-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
                
                {/* Skills/Ratings for UI purposes */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {role === 'mentee' ? 'Skills Development' : 'Mentoring Ratings'}
                  </h4>
                  
                  {['Technical Knowledge', 'Communication', 'Problem Solving', 'Leadership'].map((skill, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {75 + i * 5}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full" 
                          style={{ width: `${75 + i * 5}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                  Mark all as read
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${notification.read ? 
                      'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800' : 
                      'border-indigo-100 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20'}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${notification.read ? 
                          'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 
                          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className={`font-medium ${notification.read ? 
                            'text-gray-700 dark:text-gray-300' : 
                            'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 MentorMatch. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}