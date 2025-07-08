// auth.routes.ts
import { Router } from "express";

import { RequestHandler } from "express";
import { LiveChatAIHandler } from "../controllers/liveChatAI.controller";
import { LiveChatAIHandler2 } from "../controllers/liveChatAI2.controller";

const router = Router();

// Explicitly type the handlers as RequestHandler
router.post("/liveChatAI", LiveChatAIHandler as RequestHandler);
router.post("/liveChatAI2", LiveChatAIHandler2 as RequestHandler);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);

export default router;
