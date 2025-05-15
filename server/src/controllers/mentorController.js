const Mentor = require('../models/Mentor');

// @desc Create or Update Mentor Profile
exports.upsertMentorProfile = async (req, res) => {
  const { name, title, bio, categories, credentials, experience, price, linkedin } = req.body;

  try {
    let mentor = await Mentor.findOne({ user: req.user._id });

    if (mentor) {
      // Update
      mentor = await Mentor.findOneAndUpdate(
        { user: req.user._id },
        { name, title, bio, categories, credentials, experience, price, linkedin },
        { new: true }
      );
    } else {
      // Create
      mentor = await Mentor.create({
        user: req.user._id,
        name,
        title,
        bio,
        categories,
        credentials,
        experience,
        price,
        linkedin
      });
    }

    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get all mentors (with search/filter)
exports.getAllMentors = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const mentors = await Mentor.find(query).populate('user', 'email role');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc Get a single mentor by ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate('user', 'email role');
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
