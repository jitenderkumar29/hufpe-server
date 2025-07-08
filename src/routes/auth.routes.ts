// auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
} from "../controllers/auth.controller";
import { RequestHandler } from "express";

const router = Router();

// Explicitly type the handlers as RequestHandler
router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/forgot-password", forgotPassword as RequestHandler);

export default router;
