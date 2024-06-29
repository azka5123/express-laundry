const express = require('express');
const router = express.Router();
const { register,login,forgetPassword, getForgetPassword,logout } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/forget-password/:token', getForgetPassword);
router.post('/logout', logout);

module.exports = router;