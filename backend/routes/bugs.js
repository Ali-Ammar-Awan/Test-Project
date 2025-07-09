const express = require('express');
const router = express.Router();
const BugController = require('../app/bug/BugController');
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
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG and GIF images are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter });

router.post('/', authenticateJWT, authorizeRoles('QA'), upload.single('screenshot'), BugController.create);
router.get('/', authenticateJWT, BugController.list);
router.get('/:id', authenticateJWT, BugController.getById);
router.put('/:id', authenticateJWT, upload.single('screenshot'), BugController.update);
router.delete('/:id', authenticateJWT, BugController.delete);

module.exports = router; 