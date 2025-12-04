"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, { expiresIn: "1h" }); // replace with process.env.JWT_SECRET
};
exports.generateToken = generateToken;
