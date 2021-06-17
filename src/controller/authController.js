//require user model
const User = require('../model/userSchema');

//require the emailer service
const { emailer, recoveryPasswordTemplate, changePasswordTemplate } = require('../services/mailServices');
//require auth service
const { genToken, encrypt, decrypt, decodeToken } = require('../services/authServices');

//get login handler
module.exports.getLogin = async(req, res) => {
    //render login page
    return res.status(200).json({ message: "login page rendered" })
};

//post login handler
module.exports.postLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        //fetch the user with corresponding email
        const user = await User.findOne({ email });
        //check if there is no user
        if (!user) return res.status(404).json({ message: ' no user with that email' });

        // console.log(password, user.password)
            //if there is a user compare passwords and generate token
        if (await decrypt(password, user.password)) {
            const token = await genToken(user._id);
            res.cookie('jwt', token, { maxAge: 1000 * 3 * 24 * 60 * 60, httpOnly: true, secure: false, sameSite: "strict" });
            return res.status(200).json({ message: user })
                // res.redirect('/');
        }
        return res.status(401).json({ message: " please enter a valid password" })
    } catch (error) {
        res.status(500).json({ message: error })
    }

};
//get signup handler
module.exports.getSignup = async(req, res) => {
    //render sign up page
    return res.status(200).json({ message: "login page rendered" })
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
        // console.log(user)
            //send token to client  in a cookie
        res.cookie('jwt', token, { maxAge: 1000 * 3 * 24 * 60 * 60, httpOnly: true, secure: false, sameSite: "strict" });
        res.status(200).json({ payload: user })
            //redirect to home page
    } catch (error) {
        res.status(500).json({ message: error })
    }


};
//get logout handler
module.exports.getLogout = async(req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: "logged out successful" })
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
        // console.log(password, user.password);
        // console.log(await decrypt(password, user.password));
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

    await user.save();

    console.log(user)
    return res.status(200).json({ message: "password was successfully updated" });

};
//post recovery passowrd
module.exports.postRecoveryPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        //check if there is no user
        if (!user) return res.status(404).json({ message: ' no user with that email' });

        //if there is a user 
        //generate a token and send to email expires in 10* 60 seconds = 10mins
        const token = await genToken({ id: user._id }, validTime = 10 * 60);

        //send token to the email
        const emailStatus = await emailer(user.email, 'Recovery password Request', token, recoveryPasswordTemplate)
        if (emailStatus) return res.status(200).json({ message: "email sent" })

    } catch (error) {
        res.status(500).json({ message: error })
    }

};
//get recovery passowrd
module.exports.getRecoveryPassword = async(req, res) => {
    const newPassword = req.body.password
        //check if token is valid; and set new password
    const decodedToken = await decodeToken(req.params.token);
    //check if token is valid
    if (!decodedToken) return res.status(400).json({ message: "inavalid token" });

    //get the user from db and update password and save
    const user = await User.findByIdAndUpdate(decodedToken.payload.id, { password: newPassword }, { new: true });

    await user.save();

    console.log(user)
    return res.status(200).json({ message: "password was successfully updated" });

};