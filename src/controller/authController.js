//require user model
const User = require('../model/userSchema');
//require error handler
const { errorHandler } = require('../services/errorService');
//require the emailer service
const { emailer, recoveryPasswordTemplate, changePasswordTemplate } = require('../services/mailServices');
//require auth service
const { genToken, encrypt, decrypt, decodeToken } = require('../services/authServices');

//get login handler
module.exports.getLogin = async(req, res) => {
    //render login page
    return res.status(200).render('login.ejs')
};

//post login handler
module.exports.postLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        //fetch the user with corresponding email
        const user = await User.findOne({ email });
        //check if there is no user
        if (!user) return res.status(404).json({ message: `${email} is not a register user; you may sign up` });
        //if there is a user compare passwords and generate token and log in user
        if (await decrypt(password, user.password)) {
            const token = await genToken(user._id);
            res.cookie('jwt', token, { maxAge: 1000 * 3 * 24 * 60 * 60, httpOnly: true, secure: false, sameSite: "strict" });
            res.locals = email;
            return res.status(200).redirect('/')
        }
        return res.status(401).json({ message: " please enter a valid password" })
    } catch (error) {
        const errMessage = await errorHandler(error, email)
        if (errMessage) await res.status(500).json({ message: errMessage })
    }

};
//get signup handler
module.exports.getSignup = async(req, res) => {
    //render sign up page
    return res.status(200).render('signup.ejs')
};
//post signup handler
module.exports.postSignup = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({
            email,
            password
        });
        //create a token for the user 
        const token = await genToken(user._id);

        //send token to client  in a cookie
        res.cookie('jwt', token, { maxAge: 1000 * 3 * 24 * 60 * 60, httpOnly: true, secure: false, sameSite: "strict" });
        //redirect to home page
        res.status(200).redirect('/');
    } catch (error) {
        const errMessage = await errorHandler(error, email)
        if (errMessage) await res.status(500).json({ message: errMessage })

    }


};
//get logout handler
module.exports.getLogout = async(req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    //redirect to home page
    res.status(200).redirect('/')
};
//get upadate password
// module.exports.getUpdatePassword = (req, res) => {
//     res.status(200).json({ message: " update password" })
// };
//post update passowrd
module.exports.postUpdatePassword = async(req, res) => {
    const { email, password, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        //check if there is no user
        if (!user) return res.status(404).json({ message: ' no user with that email' });
        //if there is a user compare current password
        if (await decrypt(password, user.password)) {
            //generate a token and send to email expires in 10* 60 seconds = 10mins
            const token = await genToken({ id: user._id, newPassword }, validTime = 10 * 60);

            //send token to the email
            const emailStatus = await emailer(user.email, 'Change password Request', token, changePasswordTemplate)
            if (emailStatus) return res.status(200).json({ message: "email sent" })

        };

        return res.status(401).json({ message: "invalid password" });
    } catch (error) {
        res.status(500).json({ message: error })
    }


};
//get update passowrd
module.exports.getUpdatePassword = async(req, res) => {
    //check if token is valid; and update changes
    const decodedToken = await decodeToken(req.params.token);
    //check if token is valid
    if (!decodedToken) return res.status(400).json({ message: "inavalid token" });

    //get the user from db and update password and save
    const user = await User.findByIdAndUpdate(decodedToken.payload.id, { password: decodedToken.payload.newPassword }, { new: true });
    //save new password to user
    await user.save();
    return res.status(200).json({ message: "password was successfully updated" });

};
//forgot password handler
module.exports.forgotPassword = (req, res) => {
    //render recover page
    res.status(200).render('recovery-request.ejs')
};
//post recovery passowrd
module.exports.postRecoveryPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        //check if there is no user
        if (!user) return res.status(404).json({ message: `${email} is not registered!` });

        //if there is a user 
        //generate a token and send to email expires in 10* 60 seconds = 10mins
        const token = await genToken({ id: user._id }, validTime = 120 * 60);

        //send token to the email
        const emailStatus = await emailer(user.email, 'Recovery password Request', token, recoveryPasswordTemplate);
        // return res.status(200).render('recovery-link-sent.ejs', { email })
        res.status(200).json({ url: `/auth/recovery-link-success?email=${email}` });

    } catch (error) {
        res.status(500).json({ message: error })
    }

};
//get recovery success page
module.exports.getRecoverySuccessPage = async(req, res) => {
    const email = req.query.email;
    return res.status(200).render('recovery-link-sent.ejs', { email })
};
//get recovery password
module.exports.getRecoveryPassword = async(req, res) => {
    //decode token 
    const decodedToken = await decodeToken(req.params.token);
    //check if token is valid
    if (!decodedToken) return res.status(400).json({ message: "inavalid token", url: '/auth/login' });
    //get the user from db and update password and save
    const user = await User.findOne({ _id: decodedToken.payload.id });
    if (!user) return res.status(400).json({ message: "inavalid token", url: '/auth/login' });


    res.status(200).render('recovery-change-password.ejs', { email: user.email });
};
//put recovery passowrd
module.exports.putRecoveryPassword = async(req, res) => {
    const { email, newPassword } = req.body;

    //get the user from db and update password and save
    const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
    if (!user) return res.status(404).json({ message: `${email} is not registered!` });
    await user.save();

    return res.status(200).json({ message: "password was successfully updated", url: "/auth/login" });

};
//temporary link
//http://localhost:5500/auth/recovery-link-success?email=santabizline@gmail.com