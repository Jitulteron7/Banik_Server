const nodemailer = require("nodemailer");

class MailService {
    
    constructor() {
        this._transpoter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }
    async sendForgotPasswordMail(user, token) {
        const resetLink = `http://localhost:3000/resetpassword/${user._id}/${token}`;
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: "Password Email Link",
            text: `Click on this link to reset password: ${resetLink}`,
        };

        await this._transpoter.sendMail(mailOptions);
    }

    
}

module.exports = MailService;
