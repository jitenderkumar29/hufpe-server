// auth.routes.ts
import { Router } from "express";

import { RequestHandler } from "express";
import { registerChatUser } from "../controllers/chatUser.controller";

const router = Router();

// Explicitly type the handlers as RequestHandler
router.post("/userChat", registerChatUser as RequestHandler);
// router.post("/liveChatAI", LiveChatAIHandler as RequestHandler);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);

export default router;
