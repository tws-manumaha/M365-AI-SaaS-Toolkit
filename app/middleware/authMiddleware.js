const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ VERIFY TOKEN
function authenticate(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            message: '❌ Missing Authorization Token'
        });
    }

    // Expect: Bearer <token>
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: '❌ Invalid Token Format'
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Attach user info
        req.user = {
            username: decoded.username,
            role: decoded.role
        };

        next();

    } catch (err) {

        return res.status(403).json({
            message: '❌ Invalid or Expired Token'
        });
    }
}


// ✅ ROLE-BASED ACCESS
function authorize(roles = []) {

    return (req, res, next) => {

        if (!roles.length) {
            return next();
        }

        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: '❌ Access Denied'
            });
        }

        next();
    };
}


// ✅ OPTIONAL ADMIN-ONLY SHORTCUT
function adminOnly(req, res, next) {

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: '❌ Admin access required'
        });
    }

    next();
}


// ✅ EXPORT
module.exports = {
    authenticate,
    authorize,
    adminOnly
};