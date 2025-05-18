const Mentor = require('../models/Mentor');

// @desc Create or Update Mentor Profile
exports.upsertMentorProfile = async (req, res) => {
  try {
    const { name, title, bio, categories, credentials, experience, price, linkedin, availableDates } = req.body;
    
    // Get user ID from the authenticated user (middleware sets req.user)
    const userId = req.user._id;

    // Prepare mentor data
    const mentorData = {
      name,
      title,
      bio,
      categories: Array.isArray(categories) ? categories : [],
      credentials: Array.isArray(credentials) ? credentials : [],
      experience: Number(experience) || 0,
      price: Number(price) || 0,
      linkedin,
      availableDates: Array.isArray(availableDates) ? availableDates : []
    };

    // Use findOneAndUpdate with upsert to create or update
    const mentor = await Mentor.findOneAndUpdate(
      { user: userId }, // Find by user reference
      { 
        $set: {
          ...mentorData,
          user: userId // Ensure user reference is set
        }
      },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true // Apply schema defaults on creation
      }
    ).populate('user', 'name email role');

    res.status(200).json({
      success: true,
      data: mentor,
      message: mentor.isNew ? 'Mentor profile created successfully' : 'Mentor profile updated successfully'
    });

  } catch (error) {
    console.error('Error in upsertMentorProfile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while saving mentor profile',
      details: error.message 
    });
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

    const mentors = await Mentor.find(query).populate('user', 'name email role');
    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors
    });
  } catch (error) {
    console.error('Error in getAllMentors:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching mentors' 
    });
  }
};

// @desc Get a single mentor by user ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.params.id }).populate('user', 'name email role');
    
    if (!mentor) {
      return res.status(404).json({ 
        success: false,
        error: 'Mentor not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Error in getMentorById:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching mentor' 
    });
  }
};