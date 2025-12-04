"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const user_model_1 = require("../../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StatusCode_1 = require("../../helper/StatusCode");
const auth_repositories_1 = require("../../repositories/auth.repositories");
const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
class AuthController {
    /**
     * Register Controller
     */
    async register(req, res) {
        try {
            const { error, value } = user_model_1.UserSchemaValidate.validate(req.body);
            if (error) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: error.details[0].message
                });
            }
            const result = await auth_repositories_1.authRepositories.registerUser(value);
            if (result.success) {
                return res
                    .status(result.statusCode)
                    .json({ success: true, message: result.message, user: result.user });
            }
            else {
                return res
                    .status(result.statusCode)
                    .json({ success: false, message: result.message });
            }
        }
        catch (error) {
            console.error("Register Error:", error);
            return res
                .status(StatusCode_1.StatusCode.SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }
    /**
     * Login Controller
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(StatusCode_1.StatusCode.BAD_REQUEST)
                    .json({ success: false, message: "Email and password are required" });
            }
            const result = await auth_repositories_1.authRepositories.loginUser(email, password);
            if (result.success) {
                return res.status(result.statusCode).json({
                    success: true,
                    message: result.message,
                    token: result.token,
                    user: result.user
                });
            }
            else {
                return res
                    .status(result.statusCode)
                    .json({ success: false, message: result.message });
            }
        }
        catch (error) {
            console.error("Login Error:", error);
            return res
                .status(StatusCode_1.StatusCode.SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    }
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            const user = await user_model_1.UserModel.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid verification link" });
            }
            if (user.isVerified) {
                return res.status(200).json({ success: true, message: "Email already verified" });
            }
            user.isVerified = true;
            await user.save();
            return res.status(200).json({ success: true, message: "Email verified successfully!" });
        }
        catch (error) {
            console.error("Email verification error:", error);
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
    }
}
exports.authController = new AuthController();
