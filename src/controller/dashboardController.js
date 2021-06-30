//import decode token
const { decodeToken } = require('../services/authServices');
//import mail services
const { emailer } = require('../services/mailServices');
//require user model
const User = require('../model/userSchema');
//require error handler
const { errorHandler } = require('../services/errorService');
//require templates
const inviteTemplate = require('../templates/invite-templates/template-01');

//get dashboard
module.exports.getDashboard = async(req, res) => {
    res.status(200).render('dashboard.ejs');
};
//get send invite
module.exports.getSendInvite = async(req, res) => {
    res.status(200).render('wedding-invitation-card.ejs');
};
//post send invite
module.exports.postSendInvite = async(req, res) => {
    console.log('hrere')
    const selectedTemplate = "template_01"
    console.log(req.body)
        //get options from request body 
    const { groomsName, bridesName, groomfamiliesName, bridefamiliesName, dateOfWedding, courtesyFamily, emailList, senderName, subject } = req.body;
    try {
        //check if user is logged in and get their id
        const token = req.cookies.jwt;
        const decodedToken = await decodeToken(token);
        if (!decodedToken) return res.status(401).json({ message: 'not authorize to send invite you must be logged in', url: '/auth/login' });
        //get email from token
        const user = await User.findById(decodedToken.payload);
        //assign sender email
        const sender = user.email;
        //send email invite to the list of emails'
        // const recieversEmail = emailList.join(", ");
        const emailStatus = await emailer({
            recieversEmail: emailList,
            sender,
            senderName,
            subject,
            template: inviteTemplate[selectedTemplate]({
                groomsName,
                bridesName,
                groomfamiliesName,
                bridefamiliesName,
                dateOfWedding,
                courtesyFamily,
            })
        });
        if (emailStatus) {
            console.log("success")
        }
        // console.log({ template: inviteTemplate[selectedTemplate]({ groomsName: "amanze", bridesName: "anyanwu", groomfamiliesName: "kechi", bridefamiliesName: "prince", dateOfWedding: "2/3/2021", courtesyFamily: "brides family" }) });
        //redirect to dashboard
        res.status(200).json({ message: ' invitations sent success', url: '/dashboard' });
    } catch (error) {
        const errMessage = await errorHandler(error, email)
        if (errMessage) await res.status(500).json({ message: errMessage })
    }

};

//edit profile get handler
module.exports.getEditProfile = async(req, res) => {

};
//edit profile post handler
module.exports.postEditProfile = async(req, res) => {

};