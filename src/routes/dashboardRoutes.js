//require router
const router = require('express').Router();
//require dashboard controllers
const { postSendInvite, getSendInvite, getDashboard, getEditProfile, postEditProfile } = require('../controller/dashboardController');
//dashboard route
router.get('/', getDashboard);
//send invite route
router.get('/send-invite', getSendInvite);
//send invite route
router.post('/send-invite', postSendInvite);
//edit profile get route
router.get('/edit-profile', getEditProfile);
//edit profile post route
router.post('/edit-profile', postEditProfile);


module.exports = router;