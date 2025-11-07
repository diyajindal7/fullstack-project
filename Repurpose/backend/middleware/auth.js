const jwt = require('jsonwebtoken');

function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
      // ✅ Use same fallback as login route
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
      req.user = decoded;

      // ✅ Role check (use decoded.role here, not user_type)
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      console.error('❌ Token error:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;
