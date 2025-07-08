// auth.routes.ts
import { Router } from "express";

import { RequestHandler } from "express";
import { resourcesEnquiry } from "../controllers/resources.controller";

const router = Router();

// Explicitly type the handlers as RequestHandler
router.post("/resources-enquiry", resourcesEnquiry as RequestHandler);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);

export default router;
