import { useEffect, useState } from 'react';
import axios from 'axios';
import BookingButton from '../components/booking/BookingButton';

export default function MentorSearch() {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await axios.get('/api/mentors', { params });
        console.log('Mentors response:', res.data);
        setMentors(res.data.data);
        if (res.data.data.length === 0) {
          setMessage('No mentors found matching your criteria.');
        } else {
          setMessage('');
        }
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setMessage('Error loading mentors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [searchTerm, categoryFilter, minPrice, maxPrice]);

  // Show loading state
  if (isLoading && mentors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <p className="text-center text-gray-600 dark:text-slate-400">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4">
          Find a Mentor
        </h2>

        {message && (
          <div className={`p-3 mb-4 rounded ${
            message.includes('Error') || message.includes('error')
              ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Search by name or bio
              </label>
              <input
                type="text"
                placeholder="Search mentors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setSearchTerm(query)}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-slate-400 my-8">Searching for mentors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors && mentors.length > 0 ? (
              mentors.map((mentor) => (
                <div key={mentor._id} className="border border-gray-200 dark:border-slate-700 p-6 rounded-lg shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{mentor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{mentor.credentials}</p>
                    </div>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">₹ {mentor.price} / session</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700 dark:text-slate-300">{mentor.description || mentor.bio}</p>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mentor.categories && mentor.categories.map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                    <BookingButton 
                      mentor={mentor} 
                      date="2025-05-20" 
                      slot="10:00 AM"
                      className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 text-sm transition-colors" 
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-400 col-span-full text-center">No mentors found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}