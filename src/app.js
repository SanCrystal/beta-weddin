/**
 * create an express server
 */
// require cors
const cors = require("cors")
    //require path 
const path = require("path");
//require express
const express = require('express');
//require ejs
const ejs = require('ejs');
//require passport
const passport = require('passport');
//require cookie parser
const cookieParser = require('cookie-parser');
//require cookie session
const cookieSession = require('cookie-session');
//require database 
const { db } = require('./db/db');
//require env file
require('dotenv').config()
const PORT = process.env.PORT || 5000;
//require google strategy
const googleAuthService = require('./services/googleAuthService');
//require facebook strategy
const facebookAuthService = require('./services/facebookAuthService');
//require auth service
const { isAuthorized, isAuthorizedHome } = require('./services/isAuthorized');
//require auth routes
const authRoutes = require('./routes/authRoutes');

//require user
const User = require('./model/userSchema')
    //initalize db
db();



//initailize app 
const app = express();
//set view engine 
app.set('view engine', ejs);
//set views default path
app.set('views', path.join(__dirname + '/views'));
// cors setup for express app
app.use(cors("*"));
//use body parser
app.use(express.json());
//use session cookies
app.use(cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: [process.env.SECRET],
    sameSite: "strict",
    secure: false
}));
//use passport middleware initializer
app.use(passport.initialize());
//consume the session cookies
app.use(passport.session());
//use cookie passer
app.use(cookieParser());
//serve static files
app.use('/static', express.static(path.join(__dirname, "frontend")));
// app.get('*', isAuthorized);
//home route
app.get('/', isAuthorizedHome, (req, res) => {
    res.render('index.ejs');

});
//require auth routes
app.use('/auth', authRoutes);


//listen to port 
app.listen(PORT, () => console.log(`server is up on port ${PORT}`))