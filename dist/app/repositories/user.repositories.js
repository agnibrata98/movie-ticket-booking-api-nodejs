"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositories = void 0;
const user_model_1 = require("../models/user.model");
const jwtSecret = process.env.JWT_SECRET || "your_secret_key";
class UserRepositories {
    //   for getting user profile
    async getProfile(userId) {
        try {
            const user = await user_model_1.UserModel.findById(userId).select("-password"); // Exclude password
            return user;
        }
        catch (error) {
            throw new Error(`Error fetching user profile: ${error}`);
        }
    }
}
const userRepositories = new UserRepositories();
exports.userRepositories = userRepositories;
