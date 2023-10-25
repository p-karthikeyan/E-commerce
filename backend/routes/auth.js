const express = require('express');
const {isAuthenticate, AuthorizeUser} = require('../middlewares/authenticate')
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getResetPasswordLink, 
    resetPassword, 
    getProfile, 
    changePassword, 
    updateProfile, 
    getUsers, 
    getUser, 
    updateUser, 
    deleteUser
} = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/forgetPassword').post(getResetPasswordLink);
router.route('/resetPassword/:token').post(resetPassword);

router.route('/myProfile').get(isAuthenticate,getProfile);
router.route('/updateProfile').put(isAuthenticate,updateProfile);
router.route('/changePassword').put(isAuthenticate,changePassword);

router.route('/admin/users').get(isAuthenticate,AuthorizeUser('admin'),getUsers);
router.route('/admin/manageUser/:id')
            .get(isAuthenticate,AuthorizeUser('admin'),getUser)
            .put(isAuthenticate,AuthorizeUser('admin'),updateUser)
            .delete(isAuthenticate,AuthorizeUser('admin'),deleteUser)


module.exports = router;