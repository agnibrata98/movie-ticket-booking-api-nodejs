"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
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
