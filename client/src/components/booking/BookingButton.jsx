import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function BookingButton({ mentor, date, slot }) {
const { user } = useAuth();
const [loading, setLoading] = useState(false);

const loadRazorpayScript = () => {
return new Promise((resolve) => {
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.onload = () => resolve(true);
script.onerror = () => resolve(false);
document.body.appendChild(script);
});
};

const handleBooking = async () => {
if (!user?.token || !mentor?._id || !date || !slot) {
toast.error('Missing booking details. Please try again.');
return;
}


const isLoaded = await loadRazorpayScript();
if (!isLoaded) {
  toast.error('Failed to load Razorpay SDK. Check your connection.');
  return;
}

setLoading(true);

try {
  const headers = { Authorization: `Bearer ${user.token}` };

  const { data } = await axios.post(
    '/api/payments/create-order',
    {
      amount: mentor.price,
      mentorId: mentor._id,
      date,
      slot,
    },
    { headers }
  );

  const { order, bookingId } = data;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: 'INR',
    name: 'Mentor Booking',
    description: `Session with ${mentor.name}`,
    order_id: order.id,
    handler: async (response) => {
      try {
        await axios.post(
          '/api/payments/verify-payment',
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            bookingId,
          },
          { headers }
        );
        toast.success('Booking successful!');
      } catch (err) {
        console.error('Verification error:', err);
        toast.error('Payment verification failed. Please contact support.');
      }
    },
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
    },
    theme: {
      color: '#4F46E5',
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
} catch (err) {
  console.error('Booking failed:', err);
  toast.error('Booking failed. Please try again later.');
} finally {
  setLoading(false);
}
};

return (
<button onClick={handleBooking} disabled={loading} className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" >
{loading ? 'Processing...' : 'Book Session'}
</button>
);
}