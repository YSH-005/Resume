import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Edit3, Trash2, Send, X, Link, Image } from 'lucide-react';

const Post = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState({});
  const [editCommentText, setEditCommentText] = useState('');

  // Form state for creating new post
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
    link: ''
  });

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', content: '', image: '', link: '' });
        setShowCreateForm(false);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Error creating post');
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      setError('Error deleting post');
    }
  };

  // Toggle like
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: data.liked 
                ? [...post.likes, user.id]
                : post.likes.filter(id => id !== user.id),
              likeCount: data.totalLikes
            };
          }
          return post;
        }));
      }
    } catch (err) {
      setError('Error updating like');
    }
  };

  // Add comment
  const handleAddComment = async (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return { ...post, comments: data.comments };
          }
          return post;
        }));
        setNewCommentText({ ...newCommentText, [postId]: '' });
      }
    } catch (err) {
      setError('Error adding comment');
    }
  };

  // Edit comment
  const handleEditComment = async (postId, commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: editCommentText })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return { ...post, comments: data.comments };
          }
          return post;
        }));
        setEditingComment(null);
        setEditCommentText('');
      }
    } catch (err) {
      setError('Error editing comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return { ...post, comments: data.comments };
          }
          return post;
        }));
      }
    } catch (err) {
      setError('Error deleting comment');
    }
  };

  // Start editing comment
  const startEditingComment = (commentId, currentText) => {
    setEditingComment(commentId);
    setEditCommentText(currentText);
  };

  // Cancel editing comment
  const cancelEditingComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  useEffect(() => {
    if (user?.token) {
      fetchPosts();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        {user?.role === 'mentor' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create Post'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-900 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Create Post Form */}
      {showCreateForm && user?.role === 'mentor' && (
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title"
                maxLength={200}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's on your mind?"
                maxLength={5000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Image size={16} className="inline mr-1" />
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Link size={16} className="inline mr-1" />
                  Link URL (optional)
                </label>
                <input
                  type="url"
                  value={newPost.link}
                  onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreatePost}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Post
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPost({ title: '', content: '', image: '', link: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No posts yet. {user?.role === 'mentor' ? 'Be the first to share something!' : 'Check back later for updates!'}</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6 border">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.mentor?.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {post.mentor?.name || 'Anonymous Mentor'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {post.mentor?.organization && `${post.mentor.organization} • `}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Delete button for post owner */}
                {user?.id === post.mentor?.user && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Post Link */}
              {post.link && (
                <div className="mb-4">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Link size={16} />
                    <span>Visit Link</span>
                  </a>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center space-x-6 py-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.likes?.includes(user.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart 
                    size={20} 
                    fill={post.likes?.includes(user.id) ? 'currentColor' : 'none'}
                  />
                  <span>{post.likeCount || post.likes?.length || 0}</span>
                </button>

                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} />
                  <span>{post.commentCount || post.comments?.length || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newCommentText[post._id] || ''}
                      onChange={(e) => setNewCommentText({
                        ...newCommentText,
                        [post._id]: e.target.value
                      })}
                      placeholder="Write a comment..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={1000}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post._id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      disabled={!newCommentText[post._id]?.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm text-gray-800">
                            {comment.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {editingComment === comment._id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              maxLength={1000}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditComment(post._id, comment._id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingComment}
                                className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mt-1">{comment.text}</p>
                        )}
                      </div>
                      
                      {/* Comment Actions */}
                      {user?.id === comment.user?._id && editingComment !== comment._id && (
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={() => startEditingComment(comment._id, comment.text)}
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center space-x-1"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post;