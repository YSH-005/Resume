const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id and role
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
exports.isMentor = (req, res, next) => {
  if (req.user.role !== 'mentor') {
    return res.status(403).json({ message: 'Access denied: mentors only' });
  }
  next();
};
