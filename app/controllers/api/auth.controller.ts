import { Request, Response } from "express";
import { UserModel, UserSchemaValidate } from "../../models/user.model";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { StatusCode } from "../../helper/StatusCode";
import { authRepositories } from "../../repositories/auth.repositories";

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

class AuthController {
  /**
   * Register Controller
   */
  async register(req: Request, res: Response): Promise<any> {
    try {
      const { error, value } = UserSchemaValidate.validate(req.body);
      if (error) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await authRepositories.registerUser(value);

      if (result.success) {
        return res
          .status(result.statusCode)
          .json({ success: true, message: result.message, user: result.user });
      } else {
        return res
          .status(result.statusCode)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Register Error:", error);
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  /**
   * Login Controller
   */
  async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ success: false, message: "Email and password are required" });
      }

      const result = await authRepositories.loginUser(email, password);

      if (result.success) {
        return res.status(result.statusCode).json({
          success: true,
          message: result.message,
          token: result.token,
          user: result.user
        });
      } else {
        return res
          .status(result.statusCode)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Login Error:", error);
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }


  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.params;

      // Verify token
      const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid verification link" });
      }

      if (user.isVerified) {
        return res.status(200).json({ success: true, message: "Email already verified" });
      }

      user.isVerified = true;
      await user.save();

      return res.status(200).json({ success: true, message: "Email verified successfully!" });
    } catch (error) {
      console.error("Email verification error:", error);
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
  }
}

export const authController = new AuthController();
