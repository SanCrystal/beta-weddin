/**
 * create an express server
 */
// require cors
const cors = require("cors")
//require path 
const path = require("path");
//require express
const express = require('express');
//require cookie parser
const cookieParser = require('cookie-parser')
    //require database 
const { db } = require('./db/db');
//require env file
require('dotenv').config()
const PORT = process.env.PORT;
//require auth service
const { genToken, encrypt, decrypt } = require('./services/authServices');
//require auth routes
const authRoutes = require('./routes/authRoutes');

//require user
const User = require('./model/userSchema')
    //initalize db
db();



//initailize app 
const app = express();
// cors setup for express app
app.use(cors());
//use body parser
app.use(express.json());
//use cookie passer
app.use(cookieParser());
//require auth routes
app.use('/auth', authRoutes);
//home route
app.get('/', (req, res) => {
    res.send(' home page');
});
//listen to port 
app.listen(PORT, () => console.log(`server is up on port ${PORT}`))