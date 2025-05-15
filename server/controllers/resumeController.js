
const Resume = require('../models/Resume');

exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, user: req.user.id });
    await resume.save();
    res.status(201).json({ message: 'Resume saved', resume });
  } catch (err) {
    res.status(500).json({ message: 'Error saving resume', error: err.message });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id });
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resumes', error: err.message });
  }
};

exports.scoreResume = async (req, res) => {
  try {
    const score = Math.floor(Math.random() * 41) + 60; // mock score between 60-100
    res.status(200).json({ message: 'Mock ATS score generated', score });
  } catch (err) {
    res.status(500).json({ message: 'Error scoring resume', error: err.message });
  }
};
