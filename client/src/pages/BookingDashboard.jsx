import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import BookingCard from '../components/booking/BookingCard';
import { useAuth } from '../context/AuthContext';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 
console.log(user);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const endpoint = user.role === 'mentor' ? '/api/bookings/mentor' : '/api/bookings/my';
        const res = await axios.get(endpoint);
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.role]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {user.role === 'mentor' ? 'Booked Sessions' : 'My Bookings'}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} role={user.role} />
          ))}
        </div>
      )}
    </div>
  );
}
