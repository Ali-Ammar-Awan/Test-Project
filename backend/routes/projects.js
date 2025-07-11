const express = require('express');
const router = express.Router();
const ProjectController = require('../app/project/ProjectController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authentication');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('manager','developer','QA'),
  upload.single('image'),
  ProjectController.create
);
router.get('/', authenticateJWT, ProjectController.list);
router.get('/:id', authenticateJWT, ProjectController.getById);
router.put('/:id', authenticateJWT, authorizeRoles('manager'), ProjectController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('manager'), ProjectController.delete);
router.post('/:id/assign', authenticateJWT, authorizeRoles('manager'), ProjectController.assignUsers);
router.get('/:id/assignees', authenticateJWT, ProjectController.getAssignees);

module.exports = router; 