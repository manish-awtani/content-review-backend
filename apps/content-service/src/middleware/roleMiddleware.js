// content-service/src/middleware/roleMiddleware.js
exports.requireRole = (role) => (req, res, next) => {
    const userRole = req.user?.role || 'user';
    if (userRole !== role && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
  