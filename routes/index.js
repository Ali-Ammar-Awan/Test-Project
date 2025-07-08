const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const projectsRouter = require('./projects');

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/projects', projectsRouter);

module.exports = router;
