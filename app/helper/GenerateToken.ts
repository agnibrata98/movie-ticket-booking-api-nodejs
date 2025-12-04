import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';


export const generateToken = (id: string): string => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "1h" }); // replace with process.env.JWT_SECRET
};
