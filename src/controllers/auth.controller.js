"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.login = exports.register = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const generateToken = (id, role) => jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body Register");
        console.log(req.body);
        const { firstName, lastName, email, password, confirmPassword, countryCode, mobile, address, role, } = req.body;
        const user = yield User_model_1.default.create({
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
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield User_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        // Verify password
        const isPasswordValid = yield user.matchPassword(password);
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
        const userData = {
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
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
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
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        yield user.save();
        const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
        yield (0, sendEmail_1.default)(user.email, "Reset Your Password", `Reset here: ${resetUrl}`);
        res.status(200).json({ message: "Email sent" });
    }
    catch (err) {
        next(err);
    }
});
exports.forgotPassword = forgotPassword;
