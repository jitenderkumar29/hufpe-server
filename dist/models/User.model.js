"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const addressSchema = new mongoose_1.default.Schema({
    country: { type: String },
    houseNumber: { type: String },
    street: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pin: { type: String },
});
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    countryCode: { type: String },
    mobile: { type: String },
    address: addressSchema,
    role: { type: String, default: "user" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    this.confirmPassword = this.password;
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
