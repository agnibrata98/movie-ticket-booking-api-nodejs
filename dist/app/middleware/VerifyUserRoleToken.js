"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserRoleToken = verifyUserRoleToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StatusCode_1 = require("../helper/StatusCode");
function verifyUserRoleToken(role) {
    return (req, res, next) => {
        try {
            let token = req.cookies?.token ||
                req.body?.token ||
                req.query?.token ||
                req.headers["authorization"] ||
                req.headers["x-access-token"];
            if (!token) {
                return res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "No token provided",
                });
            }
            // Handle Bearer prefix
            if (token.startsWith("Bearer ")) {
                token = token.slice(7).trim();
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your_secret_key");
            // Role check (supports single or multiple roles)
            const allowedRoles = Array.isArray(role) ? role : [role];
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(StatusCode_1.StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: `Access denied. Only for ${allowedRoles.join(", ")}.`,
                });
            }
            // Attach decoded user to request
            req.user = decoded;
            next();
        }
        catch (err) {
            console.error("Token verification error:", err.message);
            if (err.name === "TokenExpiredError") {
                return res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Token has expired, please log in again",
                });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Invalid token",
                });
            }
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
}
