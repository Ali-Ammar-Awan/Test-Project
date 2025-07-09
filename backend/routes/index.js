const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const projectsRouter = require('./projects');
const bugsRouter = require('./bugs');

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/projects', projectsRouter);
router.use('/bugs', bugsRouter);

module.exports = router;
