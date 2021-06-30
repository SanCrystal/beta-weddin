//require express router
const router = require('express').Router();
//require authorize home
const { isAuthorizedHome } = require('../services/isAuthorized');

//home route
router.get('/', isAuthorizedHome, (req, res) => {
    res.render('index.ejs');

});
//about route
router.get('/about', isAuthorizedHome, (req, res) => {
    res.render('about.ejs');

});
//contact route
router.get('/contact', isAuthorizedHome, (req, res) => {
    res.render('contact.ejs');

});

//support route
router.get('/support', isAuthorizedHome, (req, res) => {
    res.render('support.ejs');

});

//exports router
module.exports = router;