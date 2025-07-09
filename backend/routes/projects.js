const express = require('express');
const router = express.Router();
const ProjectController = require('../app/project/ProjectController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authentication');

router.post('/', authenticateJWT, authorizeRoles('manager'), ProjectController.create);
router.get('/', authenticateJWT, ProjectController.list);
router.get('/:id', authenticateJWT, ProjectController.getById);
router.put('/:id', authenticateJWT, authorizeRoles('manager'), ProjectController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('manager'), ProjectController.delete);
router.post('/:id/assign', authenticateJWT, authorizeRoles('manager'), ProjectController.assignUsers);
router.get('/:id/assignees', authenticateJWT, ProjectController.getAssignees);

module.exports = router; 