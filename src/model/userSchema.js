/**
 * create a user model
 * 
 */
//require mongoose
// const Schema = require('mongoose').Schema();
const mongoose = require('mongoose');
//require validator
const { isEmail } = require('validator');
//require auth services
const { encrypt } = require('../services/authServices')
    //get schema 
const { Schema } = mongoose;

const userSchema = new Schema({
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            validate: [isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: true
        }
    })
    //pre save hook
userSchema.pre('save', async function(next) {
    this.password = await encrypt(this.password);
    next();
});
const User = mongoose.model('user', userSchema);
module.exports = User;