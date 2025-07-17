const express = require('express');
const router = express.Router();
const UserController = require('../app/user/UserController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authentication');

router.get('/', authenticateJWT, authorizeRoles('manager'), UserController.getUsers);

module.exports = router;
