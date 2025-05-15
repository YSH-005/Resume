const Post = require('../models/Post');
const Mentor = require('../models/Mentor');

// @desc    Create a new post (Mentor only)
// @route   POST /api/posts
// @access  Private (Mentor)
exports.createPost = async (req, res) => {
  try {
    const { title, content, image, link } = req.body;

    const newPost = new Post({
      mentor: req.user.id, // Mentor ID
      title,
      content,
      image,
      link,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

// @desc    Get all posts (for mentees or public feed)
// @route   GET /api/posts
// @access  Private (Mentor or Mentee)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('mentor', 'name organization') // Populate mentor details
      .populate('comments.user', 'name');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

// @desc    Like or Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ liked: !hasLiked, totalLikes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('comments.user', 'name');

    res.status(200).json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};
