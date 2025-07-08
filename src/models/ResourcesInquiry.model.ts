import mongoose, { Document, Schema } from "mongoose";

export interface IEnquiry extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  category: string;
  subCategory: string;
  message: string;
  createdAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    countryCode: { type: String },
    mobile: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ResourcesEnquiry = mongoose.model<IEnquiry>("ResourcesEnquiry", enquirySchema);
export default ResourcesEnquiry;
