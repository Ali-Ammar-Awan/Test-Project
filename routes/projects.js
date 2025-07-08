const express = require('express');
const router = express.Router();
const ProjectController = require('../app/project/ProjectController');
const { authenticateJWT, authorizeRoles } = require('../app/auth/middleware');

router.post('/', authenticateJWT, authorizeRoles('manager'), ProjectController.create);
router.get('/', authenticateJWT, ProjectController.list);
router.get('/:id', authenticateJWT, ProjectController.getById);
router.put('/:id', authenticateJWT, authorizeRoles('manager'), ProjectController.update);

module.exports = router; 