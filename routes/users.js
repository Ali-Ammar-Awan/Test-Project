const express = require('express');
const router = express.Router();
const UserController = require('../app/user/UserController');

router.post('/signup', UserController.signup);

module.exports = router;
