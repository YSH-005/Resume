const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentId: String,
  orderId: String,
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },  // link to chat room
videoCallLink: { type: String, default: '' },                // video call URL set by mentor
chatActive: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
