const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 5000
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation for image
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  link: {
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return !v || /^https?:\/\/.+/i.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: {
      type: Date
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date
  }
});

// Index for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ mentor: 1 });
postSchema.index({ 'comments.user': 1 });

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtuals are included in JSON output
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update updatedAt
postSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);