import nodemailer from "nodemailer";
import { NodeMailerTransporter } from "../config/nodemailer.js";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface TransactionEmailParams {
  to: string;
  name: string;
  amount: number; // primitive number
  toAccount: string;
  reason?: string;
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
    html: "<h1>Welcome to Backend Ledger</h1><p>Thank you for registering with us. We're excited to have you on board!</p>",
  });
};

const sendTransactionEmail = async ({
  to,
  amount,
  name,
  toAccount,
}: TransactionEmailParams) => {
  const formattedAmount = amount.toFixed(2); // format to 2 decimals

  const subject = "Transaction Completed";
  const text = `Hello ${name},\n\nA transaction of amount $${formattedAmount} has been successfully credited to account ${toAccount}.\n\nThank you for using Backend-Ledger.`;
  const html = `
    <h1>Transaction Successful</h1>
    <p>Hello <strong>${name}</strong>,</p>
    <p>A transaction of <strong>$${formattedAmount}</strong> has been successfully credited to account <strong>${toAccount}</strong>.</p>
    <p>Thank you for using Backend-Ledger!</p>
  `;

  return sendEmail({ to, subject, text, html });
};

const sendTransactionFailureEmail = async ({
  to,
  name,
  amount,
  toAccount,
  reason = "Unknown error",
}: TransactionEmailParams) => {
  const formattedAmount = amount.toFixed(2);

  const subject = "Transaction Failed";
  const text = `Hello ${name},\n\nA transaction of amount $${formattedAmount} to account ${toAccount} has failed.\nReason: ${reason}\n\nPlease try again or contact support.`;

  const html = `
    <h1>Transaction Failed</h1>
    <p>Hello <strong>${name}</strong>,</p>
    <p>A transaction of <strong>$${formattedAmount}</strong> to account <strong>${toAccount}</strong> has <strong>failed</strong>.</p>
    <p>Reason: <em>${reason}</em></p>
    <p>Please try again or contact support.</p>
  `;

  return sendEmail({ to, subject, text, html });
};

export { sendEmail, sendRegistrationEmail, sendTransactionEmail };
