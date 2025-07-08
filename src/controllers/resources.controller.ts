import { Request, Response, NextFunction } from "express";
import ResourcesEnquiry from "../models/ResourcesInquiry.model";

export const resourcesEnquiry = async (
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
      countryCode,
      mobile,
      category,
      subCategory,
      message,
    } = req.body;

    const resourcesEnquiry = await ResourcesEnquiry.create({
      firstName,
      lastName,
      email,
      countryCode,
      mobile,
      category,
      subCategory,
      message,
    });

    // const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({ resourcesEnquiry });
  } catch (err) {
    next(err);
  }
};
