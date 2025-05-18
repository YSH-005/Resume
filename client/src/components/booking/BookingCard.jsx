export default function BookingCard({ booking, role }) {
  const otherPerson =
    role === 'mentee' ? booking.mentor.name : booking.mentee.name;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-md p-6 space-y-3 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {role === 'mentee' ? 'Mentor' : 'Mentee'}: {otherPerson}
      </h3>
      <p className="text-gray-600 dark:text-slate-300">
        💰 Session Price: ₹{booking.price}
      </p>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        📅 Booked on: {new Date(booking.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
