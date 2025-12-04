import { UserInterface } from "../interface/user.interface";
import { UserModel } from "../models/user.model";

const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

class UserRepositories {
  //   for getting user profile
  async getProfile(userId: string): Promise<UserInterface | null> {
    try {
      const user = await UserModel.findById(userId).select("-password"); // Exclude password
      return user;
    } catch (error) {
      throw new Error(`Error fetching user profile: ${error}`);
    }
  }
}

const userRepositories = new UserRepositories();

export { userRepositories };
