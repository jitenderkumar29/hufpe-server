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
exports.registerChatUser = void 0;
const chatUser_model_1 = __importDefault(require("../models/chatUser.model"));
const registerChatUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body RegisregisterChatUserter");
    console.log(req.body);
    try {
        console.log("req.body RegisregisterChatUserter");
        console.log(req.body);
        const { name, email, countryCode, mobile, message, whatsAppChat, liveChat, } = req.body;
        const chatUser = yield chatUser_model_1.default.create({
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
    }
    catch (err) {
        next(err);
    }
});
exports.registerChatUser = registerChatUser;
