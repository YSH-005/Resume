const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['mentor', 'mentee', 'admin'], required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },  // active booking for user
isOnline: { type: Boolean, default: false },                                            // for chat presence (optional)

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
