"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/api/user.controller");
const VerifyUserRoleToken_1 = require("../../middleware/VerifyUserRoleToken");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and account APIs
 */
/**
 * @swagger
 * /user/get-profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User]
 *     description: |
 *       Returns the profile details of the authenticated user.
 *       Requires a valid **JWT Bearer token** and role must be either **user** or **admin**.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b8c1234d90f001234abcd1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: User does not have permission (role not allowed)
 */
// get method [get] for getting user profile
userRouter.get('/get-profile', (0, VerifyUserRoleToken_1.verifyUserRoleToken)(["user", "admin"]), user_controller_1.userController.getUserProfile);
