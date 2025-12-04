import express from 'express';
import { authController } from '../../controllers/api/auth.controller';


const authRouter=express.Router()

// create method [post] for user registration
authRouter.post('/register',authController.register);

// create method [post] for user login
authRouter.post('/login',authController.login);

authRouter.get('/verify-email/:token', authController.verifyEmail);


export {authRouter};