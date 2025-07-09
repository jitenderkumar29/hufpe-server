// auth.routes.ts
import { Router } from "express";

import { RequestHandler } from "express";
import LiveChatDOAIHandler from "../controllers/liveChatDOAI.controller";

const router = Router();

// Explicitly type the handlers as RequestHandler
// router.post("/liveChatAI", LiveChatAIHandler as RequestHandler);
// router.post("/liveChatAI2", LiveChatAIHandler2 as RequestHandler);
router.post("/liveChatDOAI", LiveChatDOAIHandler as RequestHandler);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);

export default router;
