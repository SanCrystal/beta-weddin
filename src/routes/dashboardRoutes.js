//require router
const router = require('express').Router();
//require dashboard controllers
const { sendInvite, getDashboard } = require('../controller/dashboardController');
//dashboard route
router.get('/', getDashboard);
//send invite route
router.post('/send-invite', sendInvite);


module.exports = router;