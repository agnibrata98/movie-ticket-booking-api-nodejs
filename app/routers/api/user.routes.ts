import express from 'express';
import { userController } from '../../controllers/api/user.controller';
import { verifyUserRoleToken } from '../../middleware/VerifyUserRoleToken';


const userRouter=express.Router()

// get method [get] for getting user profile
userRouter.get('/get-profile', verifyUserRoleToken(["user", "admin"]) ,userController.getUserProfile);

// create method [post] for user login
// userRouter.post('/login',authController.login);

export {userRouter};