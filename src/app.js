"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resources_routes_1 = __importDefault(require("./routes/resources.routes"));
const chatUser_routes_1 = __importDefault(require("./routes/chatUser.routes"));
const chatLive_routes_1 = __importDefault(require("./routes/chatLive.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// import { errorHandler } from "./middlewares/error.middleware";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // For form data
app.use("/api/auth", auth_routes_1.default);
app.use("/api/resources", resources_routes_1.default);
app.use("/api/chat", chatUser_routes_1.default);
app.use("/api/chatLive", chatLive_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
