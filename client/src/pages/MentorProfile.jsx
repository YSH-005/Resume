import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function MentorProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    credentials: '',
    categories: '',
    description: '',
    linkedin: '',
    price: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'mentor') {
      axios.get(`/api/mentors/${user._id}`)
        .then(res => {
          if (res.data) setForm(res.data);
        }).catch(() => {});
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/mentors/createOrUpdate', { ...form, userId: user._id });
      setMessage('Profile saved!');
    } catch (err) {
      setMessage('Error saving profile');
    }
  };

  if (user?.role !== 'mentor') return <p className="p-6">Unauthorized</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Mentor Profile</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea name="credentials" value={form.credentials} onChange={handleChange} placeholder="Credentials / Experience" className="w-full p-2 border rounded" />
        <input name="categories" value={form.categories} onChange={handleChange} placeholder="Categories (comma separated)" className="w-full p-2 border rounded" />
        <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full p-2 border rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price per session (INR)" className="w-full p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Profile</button>
      </form>
    </div>
  );
}
