
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createResume, getMyResumes, scoreResume } = require('../controllers/resumeController');

router.post('/create', protect, createResume);
router.get('/my-resumes', protect, getMyResumes);
router.post('/score', protect, scoreResume);

module.exports = router;
