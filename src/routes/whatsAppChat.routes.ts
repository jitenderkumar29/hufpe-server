// auth.routes.ts
import { Router } from "express";

import { RequestHandler } from "express";
import whatsAppChatAIHandler, { handleWebhook, verifyWebhook } from "../controllers/whatsAppChatAI.controller";

const router = Router();

router.get('/webhook', verifyWebhook as RequestHandler);
router.post('/webhook', handleWebhook as RequestHandler);
// app.post('/send-message', whatsAppChatAIHandler);
router.post("/whatsAppChat",  whatsAppChatAIHandler as RequestHandler);

export default router;
