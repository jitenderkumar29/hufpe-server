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
exports.resourcesEnquiry = void 0;
const ResourcesInquiry_model_1 = __importDefault(require("../models/ResourcesInquiry.model"));
const resourcesEnquiry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body Register");
        console.log(req.body);
        const { firstName, lastName, email, countryCode, mobile, category, subCategory, message, } = req.body;
        const resourcesEnquiry = yield ResourcesInquiry_model_1.default.create({
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
    }
    catch (err) {
        next(err);
    }
});
exports.resourcesEnquiry = resourcesEnquiry;
