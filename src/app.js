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
//require cookie parser
const cookieParser = require('cookie-parser')
    //require database 
const { db } = require('./db/db');
//require env file
require('dotenv').config()
const PORT = process.env.PORT || 5500;
//require auth service
const { isAuthorized } = require('./services/isAuthorized');
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
app.use(cors());
//use body parser
app.use(express.json());

//use cookie passer
app.use(cookieParser());
//require auth routes
app.use('/auth', authRoutes);
//serve static files
app.use('/static', express.static(path.join(__dirname, "frontend")))
app.get('*', isAuthorized);
//home route
app.get('/', (req, res) => {
    res.render('index.ejs');
});
//listen to port 
app.listen(PORT, () => console.log(`server is up on port ${PORT}`))