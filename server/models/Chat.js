const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },  // link chat to booking
  isActive: { type: Boolean, default: true },  
  expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // +1 day
}

}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
