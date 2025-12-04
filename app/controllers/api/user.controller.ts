import { Request, Response } from "express";
import { StatusCode } from "../../helper/StatusCode";
import { userRepositories } from "../../repositories/user.repositories";

class UserController {
    //   for getting user profile
    async getUserProfile(req: Request, res: Response): Promise<any> {
        try {
            // Extract user ID from JWT (attached in middleware)
            const userId = (req as any).user?.id;

            if (!userId) {
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized access",
                });
            }

            const user = await userRepositories.getProfile(userId);

            if (!user) {
                return res.status(StatusCode.NOT_FOUND).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(StatusCode.OK).json({
                success: true,
                message: "User profile fetched successfully",
                data: user,
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return res.status(StatusCode.SERVER_ERROR).json({
                success: false,
                message: "Internal server error while fetching profile",
            });
        }
    }
}


export const userController = new UserController();