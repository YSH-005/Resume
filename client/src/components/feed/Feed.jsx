// src/components/feed/Feed.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useAuth } from '../../context/AuthContext';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

const fetchPosts = async () => {
  try {
    const res = await axios.get('/api/posts', {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    setPosts(res.data.reverse());
    console.log(res.data);
  } catch (err) {
    console.error('Failed to load posts', err);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {user?.role === 'mentor' && <CreatePost onPostCreated={fetchPosts} />}
      <h2 className="text-2xl font-bold mb-4">Mentor Posts</h2>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} currentUser={user} />
      ))}
    </div>
  );
}
