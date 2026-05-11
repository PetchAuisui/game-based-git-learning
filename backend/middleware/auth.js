const jwt = require('jsonwebtoken');

// For dev purposes, if no JWT_SECRET is provided, we can just use a dummy 'dev-secret'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    // For development convenience, if verifying fails, let's just mock a user if we are in dev
    if (process.env.NODE_ENV !== 'production') {
      console.warn("Invalid JWT, using fallback user for development");
      req.user = { id: 'dev-user-id' };
      return next();
    }
    res.status(401).json({ error: 'Token is not valid' });
  }
};
