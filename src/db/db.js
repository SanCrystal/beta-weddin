/**
 * create database and connect 
 */
//require mongoose 
const mongoose = require('mongoose');
require('dotenv').config()

//require connection string
const connectionString = process.env.MONGO_URL
    // const connectionString = "../../server.json";
    // console.log(connectionString)

module.exports.db = () => {

    mongoose.connect(connectionString, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(success => console.log("database connected")).catch(error => console.log(error))

}