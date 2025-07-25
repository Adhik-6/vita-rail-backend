import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const adminEmail = process.env.EMAIL_ID

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: adminEmail,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(params) {
  const { email, subject, html } = params;
  try {
    if (!email || !subject || !html) throw new Error("Email, subject, and HTML content are required");
    const res = await transporter.sendMail({
      from: adminEmail,
      to: email,
      subject,
      html,
    });

    const isEmailSent = res.accepted.includes(email);
    if (!isEmailSent) throw new Error("Can't send email");

    return { success: isEmailSent, message: "Email sent successfully" };
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, message: "Failed to send email" };
  }
}

export { sendMail };