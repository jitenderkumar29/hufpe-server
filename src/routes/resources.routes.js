"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// auth.routes.ts
const express_1 = require("express");
const resources_controller_1 = require("../controllers/resources.controller");
const router = (0, express_1.Router)();
// Explicitly type the handlers as RequestHandler
router.post("/resources-enquiry", resources_controller_1.resourcesEnquiry);
// router.post("/login", login as RequestHandler);
// router.post("/forgot-password", forgotPassword as RequestHandler);
exports.default = router;
