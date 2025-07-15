const Post = require('../models/Post');
const Mentor = require('../models/Mentor');

// @desc    Create a new post (Mentor only)
// @route   POST /api/posts
// @access  Private (Mentor)
exports.createPost = async (req, res) => {
  try {
    const { title, content, image, link } = req.body;

    // Find the mentor document using the user ID
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) {
      return res.status(403).json({ message: 'Mentor profile not found. Please create a mentor profile first.' });
    }

    const newPost = new Post({
      mentor: mentor._id, // Use mentor ID from the Mentor collection
      title,
      content,
      image,
      link,
    });

    const savedPost = await newPost.save();
    
    // Populate mentor details before sending response
    const populatedPost = await Post.findById(savedPost._id)
      .populate({
        path: 'mentor',
        select: 'name organization',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

// @desc    Get all posts (for everyone - public feed)
// @route   GET /api/posts
// @access  Private (Any authenticated user)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Most recent first
      .populate({
        path: 'mentor',
        select: 'name organization',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('comments.user', 'name email')
      .populate('likes', 'name email');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Private
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'mentor',
        select: 'name organization',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('comments.user', 'name email')
      .populate('likes', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
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
    res.status(200).json({ 
      liked: !hasLiked, 
      totalLikes: post.likes.length,
      message: hasLiked ? 'Post unliked' : 'Post liked'
    });
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

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Get the updated post with populated comments
    const updatedPost = await Post.findById(post._id)
      .populate('comments.user', 'name email');

    res.status(200).json({
      message: 'Comment added successfully',
      comments: updatedPost.comments
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// @desc    Edit a comment
// @route   PUT /api/posts/:id/comment/:commentId
// @access  Private (Comment owner only)
exports.editComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: postId, commentId } = req.params;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.text = text.trim();
    comment.updatedAt = new Date();
    await post.save();

    // Get updated post with populated comments
    const updatedPost = await Post.findById(postId)
      .populate('comments.user', 'name email');

    res.status(200).json({
      message: 'Comment updated successfully',
      comments: updatedPost.comments
    });
  } catch (err) {
    res.status(500).json({ message: 'Error editing comment', error: err.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private (Comment owner only)
exports.deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;

    const post = await Post.findById(postId).populate('mentor');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user owns the comment or is the post owner mentor
    const isCommentOwner = comment.user.toString() === req.user.id;
    const isPostOwner = post.mentor && post.mentor.user.toString() === req.user.id;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove the comment
    post.comments.pull(commentId);
    await post.save();

    // Get updated post with populated comments
    const updatedPost = await Post.findById(postId)
      .populate('comments.user', 'name email');

    res.status(200).json({
      message: 'Comment deleted successfully',
      comments: updatedPost.comments
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Post owner mentor only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('mentor');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if user is the mentor who created the post
    if (!post.mentor || post.mentor.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};