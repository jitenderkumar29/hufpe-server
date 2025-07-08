import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IAddress {
  country?: string;
  houseNumber?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  pin?: string;
}

interface IUser extends Document {
  _id: Types.ObjectId; // Explicitly type _id
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode?: string;
  mobile?: string;
  address?: IAddress;
  role: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const addressSchema = new mongoose.Schema({
  country: { type: String },
  houseNumber: { type: String },
  street: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  pin: { type: String },
});

const userSchema = new mongoose.Schema<IUser>({
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

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = this.password;
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
