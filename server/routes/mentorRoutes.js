// routes/mentorRoutes.js
const express = require('express');
const router = express.Router();
const {
  upsertMentorProfile,
  getAllMentors,
  getMentorById
} = require('../controllers/mentorController');
const { protect, isMentor } = require('../middleware/auth');

// Mentor-only route to create/update profile (use this one endpoint)
router.post('/profile', protect, isMentor, upsertMentorProfile);

// Public routes to get mentors
router.get('/', getAllMentors);
router.get('/:id', getMentorById);

module.exports = router;