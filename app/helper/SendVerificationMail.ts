
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../config/emailConfig";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost:3000"; // your frontend URL
const BACKEND_HOST = process.env.BACKEND_HOST || "http://localhost:8000"; // your frontend URL

export const sendVerificationEmail = async (
  userId: string,
  email: string,
  name: string
) => {
  try {
    // Generate a short-lived token for verification (expires in 1 day)
    const token = jwt.sign({ id: userId, email }, jwtSecret, {
      expiresIn: "1d",
    });

    // const verificationLink = `${FRONTEND_HOST}/verify-email/${token}`;
    const verificationLink = `${BACKEND_HOST}/api/auth/verify-email/${token}`;

    const mailOptions = {
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>Hello ${name},</h2>
          <p>Thanks for registering! Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationLink}" 
                style="background:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a></p>
          <p>This link will expire in 24 hours.</p>
          <hr/>
          <p>If you did not create this account, please ignore this message.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
  }
};
