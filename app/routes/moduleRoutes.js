const express = require('express');
const router = express.Router();

const usersModule = require('../modules/users');
const { authenticate, authorize } = require('../middleware/authMiddleware');


// ✅ USERS MODULE ROUTES

// 🔹 GET ALL USERS
router.get('/users',
    authenticate,
    authorize(['admin', 'viewer']),
    async (req, res) => {

        const result = await usersModule.getAllUsers(req.user.username);
        res.json(result);
    }
);


// 🔹 CREATE USER
router.post('/users',
    authenticate,
    authorize(['admin']),
    async (req, res) => {

        const result = await usersModule.createUser(
            req.user.username,
            req.body
        );

        res.json(result);
    }
);


// 🔹 DISABLE USER
router.post('/users/disable',
    authenticate,
    authorize(['admin']),
    async (req, res) => {

        const result = await usersModule.disableUser(
            req.user.username,
            req.body
        );

        res.json(result);
    }
);


// 🔹 ENABLE USER
router.post('/users/enable',
    authenticate,
    authorize(['admin']),
    async (req, res) => {

        const result = await usersModule.enableUser(
            req.user.username,
            req.body
        );

        res.json(result);
    }
);


// ✅ EXPORT ROUTER
module.exports = router;