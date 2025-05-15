const express = require('express');
const router = express.Router();
const { protect, isMentor } = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
} = require('../controllers/postController');

router.post('/', protect, isMentor, createPost);
router.get('/', protect, getAllPosts);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;
