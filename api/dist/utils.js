"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConfirmationMail = sendConfirmationMail;
exports.sendReportMail = sendReportMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "nikkatechx@gmail.com",
        pass: "ephi qazp vkpp fiko",
    },
});
async function sendConfirmationMail(toEmail, conLink) {
    const userName = toEmail?.split("@")[0];
    const mailOptions = {
        from: '"Nikka Tech" <nikkatechx@gmail.com>',
        to: toEmail,
        subject: "Welcome to eXpense",
        html: `<div style="max-width: 400px; margin: 50px auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: Arial, sans-serif; text-align: center;">
  
  <h2 style="color: #001cbbff;">Confirm Your Email</h2>
  <p style="color: #555; font-size: 16px;">
    Hi there ${userName}! 👋<br>
    Click the button below to confirm your email and login to your expense account
  </p>
  
  <a href="${conLink}" 
     style="display: inline-block; margin-top: 25px; padding: 12px 30px; background-color: #001cbbff; color: white; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px;">
    Confirm Email
  </a>
  
  <p style="color: #555; font-size: 14px; margin-top: 20px;">
    If youre not signing into eXpense, please ignore this email.
  </p>

</div>
`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
    }
}
async function sendReportMail(user, report) {
    const toEmail = "maxwellexcel2@gmail.com";
    const mailOptions = {
        from: '"Nikka Tech" <nikkatechx@gmail.com>',
        to: toEmail,
        subject: "New Issue Reported",
        html: `
      <div style="max-width: 450px; margin: 40px auto; padding: 30px; background: #ffffff; border-radius: 12px; 
      box-shadow: 0 4px 18px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">

        <h2 style="color: #d00000; text-align: center; margin-bottom: 15px;">
          New Issue Report
        </h2>

        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          <strong>User:</strong> ${user}<br>
          <strong>Report Details:</strong><br>
          ${report}
        </p>

        <div style="margin-top: 25px; padding: 15px; background: #f1f1f1; border-radius: 8px;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            This report was submitted through the eXpense system.
          </p>
        </div>

      </div>
    `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Report email sent:", info.response);
    }
    catch (error) {
        console.error("Error sending report email:", error);
    }
}
