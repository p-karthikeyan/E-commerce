const express = require('express');
const { registerUser, loginUser, logoutUser, getResetPasswordLink } = require('../controllers/authController');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/forgetPassword').post(getResetPasswordLink);

module.exports = router;