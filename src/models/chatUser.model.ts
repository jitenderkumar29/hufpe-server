import mongoose, { Document, Schema } from "mongoose";

export interface IChatUser extends Document {
  name: string;
  email: string;
  countryCode?: string;
  mobile?: string;
  whatsAppChat?: boolean;
  liveChat?: boolean;
  message: string;
  createdAt: Date;
}

const chatUserSchema = new Schema<IChatUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String },
    mobile: { type: String },
    whatsAppChat: { type: Boolean, default: false },
    liveChat: { type: Boolean, default: false },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ChatUser = mongoose.model<IChatUser>(
  "ChatUser",
  chatUserSchema
);
export default ChatUser;
