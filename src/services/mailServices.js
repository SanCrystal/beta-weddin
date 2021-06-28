//require nodemailer
const nodemailer = require('nodemailer');
//require env vars
require('dotenv').config();

//create transport

module.exports.emailer = async(mailDetails) => {
        const sender = mailDetails.sender ? mailDetails.sender : process.env.EMAIL_SENDER;
        const senderName = mailDetails.senderName ? mailDetails.senderName : process.env.EMAIL_USER;

        const html = mailDetails.token ? await mailDetails.template(mailDetails.token) : mailDetails.template

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: process.env.SERVICE_PROVIDER,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, //  email
                pass: process.env.EMAIL_PASSWORD, //  password
            },
        });

        // send mail with defined transport object
        let mailOptions = await transporter.sendMail({
            from: `"${sender}" <${senderName}>`, // sender's name and  address
            to: mailDetails.recieversEmail, // list of receiver(s)
            subject: mailDetails.subject, // Subject line
            html: await html // html body
        });
        return mailOptions.messageId;

    }
    //change password template
module.exports.changePasswordTemplate = (token) => { return `<div>
<h2>Password change page</h2>
<p><a href="${process.env.CURRENT_HOST}/auth/update-password/${token}">authorize password change</a></p>
</div>
` }
    //recovery password template
module.exports.recoveryPasswordTemplate = (token) => { return `<div>
<h2>Password recovery page</h2>
<p><a href="${process.env.CURRENT_HOST}/auth/recovery-auth-pass/${token}">authorize password recovery</a></p>
</div>
` }

// from: '"Beta Wedding" <noreply.betawedding@gmail.com>', // sender's name and  address
// to: "santacrypto.drop@gmail.com", // list of receiver(s)
// subject: "first trial nodemailer", // Subject line
// html: "<b>Hope this works</b>", // html body