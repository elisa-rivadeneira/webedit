const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.session;
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'No autenticado' });
  }
}

module.exports = requireAuth;
