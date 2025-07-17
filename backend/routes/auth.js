const express = require('express');
const router = express.Router();
const AuthController = require('../app/auth/AuthController');

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

module.exports = router; 