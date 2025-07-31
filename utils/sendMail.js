const nodemailer = require("nodemailer");
const {EmailHTML, welcomeHTML} = require('./MailTemplate');


const sendMailToUser = async (res, otp, email, username , type) => {

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      // secure: false, // use TLS
      auth: {
        user: process.env.email,     // This should be your Brevo login email
        pass: process.env.EMpass,    // This should be the Brevo SMTP key
      },
    });

 

    const mailOptions = {
      'otp' : {
        from: 'naresh.kumawat159924@gmail.com',
        to: email,
        subject: 'Your One-Time Password (OTP) - Notes.com',
        html: EmailHTML.replace('{{User}}', username)?.replace('{{OTP_CODE}}', otp),
      },
      'welcome' : {
        from: 'naresh.kumawat159924@gmail.com',
        to: email,
        subject: 'Welcome to - Notes.com',
        html: welcomeHTML.replace('{{User}}', username),
      },
    }

    const info = await transporter.sendMail(mailOptions[type]);

    if (info) {
      res.status(200).send({
        message: "email sent!",
      });
    }

  } catch (error) {
    console.error("❌ Error sending email:", error);
    if (res) {
      res.status(500).send({ error: "Failed to send email" });
    }
  }
};

module.exports = { sendMailToUser };
