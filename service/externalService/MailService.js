const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this._transpoter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false,
        user: "jitulteron9@gmail.com",
        pass: "jitul15988*",
      },
    });
  }
  async sendForgotPasswordMail(admin, token) {
    const resetLink = `http://localhost:3000/admin/resetpassword/${admin._id}/${token}`;
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: admin.email,
      subject: "Password Email Link",
      text: `Click on this link to reset password: ${resetLink}`,
    };

    await this._transpoter.sendMail(mailOptions);
  }
}

module.exports = MailService;
