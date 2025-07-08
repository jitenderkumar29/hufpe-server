"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// auth.routes.ts
const express_1 = require("express");
const liveChatAI_controller_1 = require("../controllers/liveChatAI.controller");
const liveChatAI2_controller_1 = require("../controllers/liveChatAI2.controller");
const router = (0, express_1.Router)();
// Explicitly type the handlers as RequestHandler
router.post("/liveChatAI", liveChatAI_controller_1.LiveChatAIHandler);
router.post("/liveChatAI2", liveChatAI2_controller_1.LiveChatAIHandler2);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);
exports.default = router;
