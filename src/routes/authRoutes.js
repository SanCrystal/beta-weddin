//require express router
const router = require('express').Router();
//require passport 
const passport = require('passport');
//require auth controller
const {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getLogout,
    getUpdatePassword,
    postUpdatePassword,
    forgotPassword,
    postRecoveryPassword,
    getRecoveryPassword,
    putRecoveryPassword,
    getRecoverySuccessPage,
    googleAuthHandler,
    facebookAuthHandler
} = require('../controller/authController');

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
//route for google consent, login and signup
//get consent from user
router.get('/google/user-consent', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
//redirect consent handler
router.get('/google-auth-redirect', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthHandler);
//route for facebook consent, login and signup
//get consent from user
router.get('/facebook/user-consent', passport.authenticate('facebook', { scope: ['email'] }));
//redirect consent handler
router.get('/facebook-auth-redirect', passport.authenticate('facebook', { failureRedirect: '/login' }), facebookAuthHandler);
//change password get
// router.get('/update-password', getUpdatePassword)
//change password post route
router.post('/update-password', postUpdatePassword);
//change password get route
router.get('/update-password/:token', getUpdatePassword);
//forgot password route
router.get('/recovery-request', forgotPassword); //send url with email params
//recovery password get route
router.post('/recovery-auth-pass', postRecoveryPassword);
//recovery link successfully sent
router.get('/recovery-link-success', getRecoverySuccessPage)
    //recovery password get route
router.get('/recovery-auth-pass/:token', getRecoveryPassword);
//recovery password get route
router.put('/recovery-auth-pass/:token', putRecoveryPassword);


module.exports = router;