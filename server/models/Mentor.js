const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK to User
  name: { type: String, required: true },
  title: { type: String },
  bio: { type: String },
  categories: [String], // e.g. ["Web Dev", "DSA"]
  credentials: [String], // e.g. ["Google SWE", "IIT Delhi"]
  experience: { type: Number }, // in years
  price: { type: Number, required: true }, // per session
  linkedin: { type: String },
  availableDates: [{ type: Date }],  // array of dates mentor is available for booking

  posts: [
    {
      title: String,
      content: String,
      image: String,
      date: Date,
      link: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
