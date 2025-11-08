const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rutas protegidas
router.get('/profile', verifyToken, authController.getProfile);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
