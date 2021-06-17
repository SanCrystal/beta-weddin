//require express router
const router = require('express').Router();
//require auth controller
const { getLogin, postLogin, getSignup, postSignup, getLogout, getUpdatePassword, postUpdatePassword, postRecoveryPassword, getRecoveryPassword } = require('../controller/authController');

//login route get
router.get('/login', getLogin);
//login route post
router.post('/login', postLogin);
//signup route post
router.post('/register', postSignup);
//signup route get
router.get('/register', getSignup);
//logout route get
router.get('/logout', getLogout);
//change password get
// router.get('/update-password', getUpdatePassword)
//change password post route
router.post('/update-password', postUpdatePassword);
//change password get route
router.get('/update-password/:token', getUpdatePassword);
//recovery password get route
router.get('/recovery-auth-pass/:token', getRecoveryPassword);
//recovery password get route
router.post('/recovery-auth-pass', postRecoveryPassword);

module.exports = router;