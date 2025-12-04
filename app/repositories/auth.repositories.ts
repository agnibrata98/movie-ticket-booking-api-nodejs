
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInterface } from "../interface/user.interface";
import { UserModel } from "../models/user.model";
import { sendVerificationEmail } from "../helper/SendVerificationMail";

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

class AuthRepositories {
  /**
   * Register a new user
   */
  async registerUser(userData: UserInterface) {
    const { name, email, phone, address, password } = userData;

    // Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        statusCode: 409,
        message: "User already exists"
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    //   role
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser._id.toString(), newUser.email, newUser.name);

    return {
      success: true,
      statusCode: 201,
      message: "User registered successfully. Please check your email to verify your account.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        // role: newUser.role
      }
    };
  }

  /**
   * Login an existing user
   */
  async loginUser(email: string, password: string) {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found"
      };
    }

    if (!user.isVerified) {
      return {
        success: false,
        statusCode: 403,
        message: "Please verify your email before logging in",
      };
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: 401,
        message: "Invalid email or password"
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      statusCode: 200,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

const authRepositories = new AuthRepositories();

export { authRepositories };