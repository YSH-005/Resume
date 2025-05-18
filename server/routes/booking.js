const express = require('express');
const router = express.Router();
const { protect, isMentor } = require('../middleware/auth');
const Booking = require('../models/Booking');

router.post('/:id/video-call-link', protect, isMentor, async (req, res) => {
  const bookingId = req.params.id;
  const { videoCallLink } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.videoCallLink = videoCallLink;
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
