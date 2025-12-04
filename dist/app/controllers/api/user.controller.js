"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const StatusCode_1 = require("../../helper/StatusCode");
const user_repositories_1 = require("../../repositories/user.repositories");
class UserController {
    //   for getting user profile
    async getUserProfile(req, res) {
        try {
            // Extract user ID from JWT (attached in middleware)
            const userId = req.user?.id;
            if (!userId) {
                return res.status(StatusCode_1.StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }
            const user = await user_repositories_1.userRepositories.getProfile(userId);
            if (!user) {
                return res.status(StatusCode_1.StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            }
            return res.status(StatusCode_1.StatusCode.OK).json({
                success: true,
                message: "User profile fetched successfully",
                data: user,
            });
        }
        catch (error) {
            console.error("Error fetching user profile:", error);
            return res.status(StatusCode_1.StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching profile",
            });
        }
    }
}
exports.userController = new UserController();
