import nodemailer from "nodemailer";
import { NodeMailerTransporter } from "../config/nodemailer.js";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Function to send email
const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    const info = await NodeMailerTransporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendRegistrationEmail = async (to: string) => {
    return await sendEmail({
        to,
        subject: "Welcome to Backend Ledger!",
        text: "Thank you for registering with us. We're excited to have you on board!",
        html: "<h1>Welcome to Backend Ledger</h1><p>Thank you for registering with us. We're excited to have you on board!</p>"
    })
}


export { sendEmail, sendRegistrationEmail }