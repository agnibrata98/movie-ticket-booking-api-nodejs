import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST || "smtp.gmail.com",
  // port: Number(process.env.EMAIL_PORT) || 465,
  // secure: true, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Admin Gmail ID
    pass: process.env.EMAIL_PASS, // Admin Gmail Password or App Password
  },
});

// Optional: verify connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email transporter error:", error);
//   } else {
//     console.log("✅ Email transporter ready");
//   }
// });
