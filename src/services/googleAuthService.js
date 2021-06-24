//require env vars
require('dotenv').config();
//require google strategy from OAUTH
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//require passport 
const passport = require('passport');
//require the user model
const User = require('../model/userSchema');



//create new google strategy 
passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google-auth-redirect'
        }, async(accessToken, refreshToken, profile, done) => {
            const currentUser = profile._json;
            //check if there is a user in the database with current google ID associated with the given mail
            const user = await User.findOne({ email: currentUser.email });
            if (!user) {

                try {
                    //create a new user with current info
                    const newUser = await User.create({
                        email: currentUser.email,
                        fullName: currentUser.name,
                        googleId: currentUser.sub,
                        password: process.env.DEFAULT_PASS_FOR_THIRD_PARTY_USERS

                    });
                    done(null, newUser)
                } catch (error) {
                    console.log(error)
                    done(error, null);

                }
            } else {
                done(null, user)
            }

        })
    )
    //serializer user id and send to cookie in the browser
passport.serializeUser((user, done) => {
    done(null, user.id)
});
//deserializer user id from the browser and run check
passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id)
    done(null, user)
})