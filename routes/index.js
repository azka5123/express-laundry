const express = require('express');
const checkAuth = require('../middleware/checkAuth')
const authRoutes = require('./auth');
const userRoutes = require('./user');

const router = express.Router();

router.use('/auth',authRoutes);

router.use('/user',checkAuth,userRoutes);

module.exports = router;