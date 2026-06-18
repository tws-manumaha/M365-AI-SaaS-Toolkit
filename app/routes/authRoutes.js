const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// ✅ TEMP USER STORE (REPLACE WITH DB LATER)
const USERS = [
    {
        username: 'admin',
        password: 'Admin@123',
        role: 'admin'
    },
    {
        username: 'viewer',
        password: 'Viewer@123',
        role: 'viewer'
    }
];


// ✅ LOGIN ROUTE
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password required'
        });
    }

    // ✅ FIND USER
    const user = USERS.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // ✅ GENERATE TOKEN
    const token = jwt.sign(
        {
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES || '8h'
        }
    );

    res.json({
        success: true,
        token,
        user: {
            username: user.username,
            role: user.role
        }
    });
});


// ✅ LOGOUT (FRONTEND SHOULD DELETE TOKEN)
router.post('/logout', (req, res) => {

    res.json({
        success: true,
        message: '✅ Logged out successfully'
    });
});


// ✅ EXPORT
module.exports = router;