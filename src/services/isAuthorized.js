//require auth service
const { decodeToken } = require('../services/authServices');
//require user model
const User = require('../model/userSchema');


module.exports.isAuthorized = async(req, res, next) => { //check if user is logged in 
    //get the user valid token
    const token = req.cookies.jwt;
    if (!token) {
        res.locals.email = null;
    }

    //verify the token if there is one
    if (token) {
        const decodedToken = await decodeToken(token);
        if (!decodedToken) {
            res.locals.email = null;
        }
        const user = await User.findById(decodedToken.payload)
        if (user) {
            res.locals.email = user.email;
            next()
        }

    } else {
        // res.locals.email = null;
        res.redirect('/auth/login');
        // res.status(401).json({ message: "Access denied, must be logged in " });
    };
};