const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const Mail = require("nodemailer/lib/mailer");
dotenv.config();

async function sendMail(email, subject, html) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: { user: process.env.APP_USER, pass: process.env.APP_PASSWORD },
    });
    await transport.sendMail({
      from: `GigIt - ${process.env.APP_USER}`,
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: "logo.jpg",
          path: path.join(__dirname, "mail", "logo.jpg"),
          cid: "companyLogo",
        },
      ],
    });
    return true;
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendMail;
