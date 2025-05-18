// src/components/feed/PostCard.jsx
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

export default function PostCard({ post, currentUser }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');

  const hasLiked = likes.includes(currentUser._id);

  const toggleLike = async () => {
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setLikes(res.data.likes);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setComments(res.data.comments);
      setNewComment('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <div className="mb-1 text-sm text-gray-500">
        Posted by {post.mentor?.name || 'Mentor'} – {moment(post.createdAt).fromNow()}
      </div>
      <h3 className="text-lg font-bold">{post.title}</h3>
      <p className="mb-2">{post.content}</p>

      <div className="flex items-center gap-4 text-sm">
        <button onClick={toggleLike} className="text-blue-500">
          {hasLiked ? '❤️ Liked' : '🤍 Like'} ({likes.length})
        </button>
      </div>

      <div className="mt-4">
        <form onSubmit={submitComment} className="flex gap-2 mb-2">
          <input
            type="text"
            className="border rounded p-1 flex-1"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="bg-gray-200 px-2 rounded">Post</button>
        </form>
        {comments.map((c, idx) => (
          <div key={idx} className="text-sm text-gray-700 border-t py-1">
            <strong>{c.user?.name || 'User'}:</strong> {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}
