import { useEffect, useState } from 'react';
import axios from 'axios';
import BookingButton from '../components/booking/BookingButton';
export default function MentorSearch() {
  const [mentors, setMentors] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const params = {};

        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await axios.get('/api/mentors', { params });
        console.log('Mentors response:', res.data);
        setMentors(res.data);
      } catch (err) {
        console.error('Error fetching mentors:', err);
      }
    };

    fetchMentors();
  }, [searchTerm, categoryFilter, minPrice, maxPrice]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Find a Mentor</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or bio"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        
        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={() => setSearchTerm(query)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div key={mentor._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-xl font-bold">{mentor.name}</h3>
              <p className="text-sm text-gray-600">{mentor.credentials}</p>
              <p className="text-gray-700">{mentor.description || mentor.bio}</p>
              <p className="text-blue-600">{mentor.categories}</p>
              <a
                href={mentor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm"
              >
                LinkedIn
              </a>
              <p className="mt-2 text-sm font-semibold">₹ {mentor.price} / session</p>  
            <BookingButton mentor={mentor} date="2025-05-20" slot="10:00 AM" />
            </div>

          ))
        ) : (
          <p className="text-gray-500 col-span-full">No mentors found.</p>
        )}
      </div>
      
    </div>
  );
}
