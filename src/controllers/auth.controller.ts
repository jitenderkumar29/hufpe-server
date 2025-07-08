import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";

interface LoginRequestBody {
  email: string;
  password: string;
  role: string;
}

interface UserResponse {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  address?: {
    country?: string;
    houseNumber?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pin?: string;
  };
}
const generateToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "1d" });

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.body Register");
    console.log(req.body);
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      countryCode,
      mobile,
      address,
      role,
    } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      countryCode,
      mobile,
      address,
      role,
    });

    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify role
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied for this role",
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    // Prepare user data for response
    const userData: UserResponse = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      address: user.address,
    };

    return res.status(200).json({
      success: true,
      token,
      user: userData,
    });
  } catch (err) {
    next(err);
  }
};

// function generateToken(userId: string, role: string): string {
//   // Implement your JWT token generation logic here
//   return "generated.jwt.token";
// }
// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("req.body login");
//     console.log(req.body);
//     const { email, password, role } = req.body;
//     const user = await User.findOne({ email });
//     // if (!user || !(await user.matchPassword(password))) {
//     //   res.status(401).json({ message: "Invalid credentials" });
//     //   return;
//     // }
//     if (!user) {
//       res.status(401).json({ message: "Invalid credentials" });
//       return;
//     }
//     const token = generateToken(user._id.toString(), user.role);
//     res.status(200).json({ token, user });
//   } catch (err) {
//     next(err);
//   }
// };

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      "Reset Your Password",
      `Reset here: ${resetUrl}`
    );

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    next(err);
  }
};
