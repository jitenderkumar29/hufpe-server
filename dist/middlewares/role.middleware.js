"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user || !roles.includes(req.user.role)) {
            // if (!roles.includes(req.user?.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient Role" });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
