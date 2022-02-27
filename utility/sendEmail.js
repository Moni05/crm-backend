const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const smtpTransporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
});


const mailOption = ({ email, pin, type, verificationLink }) => {

  let info = "";

  switch (type) {

    case "request-new-password":

      info = {
        from: '"CRM Solutions" <process.env.EMAIL>',
        to: email,
        subject: "Password Reset Pin",
        text: "Here is your password rest pin" + pin + " This pin will expires in 1day",
        html: `
                <h3>Hello<h3/>
                <p>Here is your password rest pin <b>${pin}</b>This pin will expires in 1day</p>
                `,
      }

      sendEmail(info);
      break;

    case "password-update-success":

      info = {
        from: '"CRM Solutions" <process.env.EMAIL>',
        to: email,
        subject: "Your password is updated",
        text: "Your new password has been updated",
        html: `
                <h3>Hello<h3/>
                <p>Your new password has been updated</p>
                `,
      }

      sendEmail(info);
      break;

      case "verify-new-user":

        info = {
          from: '"CRM Solutions" <process.env.EMAIL>',
          to: email,
          subject: "CRM Solutions Email Verification",
          text: "Please verify your email address by clicking the verification link here:",
          html: `
                  <h3>Hello<h3/>
                  <p>Please verify your email address by clicking the verification link here:  <a href=${verificationLink} target="_blank">${verificationLink}</a> </p>
                  `,
        }
  
        sendEmail(info);
        break;

    default:
      break;

  }
  
}



const sendEmail = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await smtpTransporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);

      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {mailOption};