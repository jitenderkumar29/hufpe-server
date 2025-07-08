import { Request, Response, NextFunction } from "express";
import ChatUser from "../models/chatUser.model";

export const registerChatUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req.body RegisregisterChatUserter");
  console.log(req.body);

  try {
    console.log("req.body RegisregisterChatUserter");
    console.log(req.body);
    const {
      name,
      email,
      countryCode,
      mobile,
      message,
      whatsAppChat,
      liveChat,
    } = req.body;

    const chatUser = await ChatUser.create({
      name,
      email,
      countryCode,
      mobile,
      whatsAppChat,
      liveChat,
      message,
    });

    // const token = generateToken(user._id.toString(), user.role);
    res.status(201).json(chatUser);
  } catch (err) {
    next(err);
  }
};
