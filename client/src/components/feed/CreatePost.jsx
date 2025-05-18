// src/components/feed/CreatePost.jsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTitle('');
      setContent('');
      onPostCreated(); // Refresh feed
    } catch (err) {
      console.error('Post creation failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 mb-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Create a Post</h3>
      <input
        type="text"
        placeholder="Post title"
        className="w-full border p-2 mb-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Share your experience or tip..."
        className="w-full border p-2 mb-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
}
