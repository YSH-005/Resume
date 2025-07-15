const express = require('express');
const router = express.Router();
const { protect, isMentor } = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  editComment,
  deleteComment,
  deletePost,
} = require('../controllers/postController');

// Post routes
router.post('/', protect, isMentor, createPost);           // Create post (Mentor only)
router.get('/', protect, getAllPosts);                     // Get all posts (Any authenticated user)
router.get('/:id', protect, getPostById);                  // Get single post (Any authenticated user)
router.delete('/:id', protect, deletePost);                // Delete post (Post owner only)

// Like routes
router.post('/:id/like', protect, likePost);               // Like/Unlike post (Any authenticated user)

// Comment routes
router.post('/:id/comment', protect, commentOnPost);       // Add comment (Any authenticated user)
router.put('/:id/comment/:commentId', protect, editComment); // Edit comment (Comment owner only)
router.delete('/:id/comment/:commentId', protect, deleteComment); // Delete comment (Comment owner or post owner)

module.exports = router;