import express from 'express';
import { userController } from '../../controllers/api/user.controller';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';


const userRouter=express.Router()

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
userRouter.get('/get-profile', verifyUserRoleToken(["user", "admin"]) ,userController.getUserProfile);


export {userRouter};