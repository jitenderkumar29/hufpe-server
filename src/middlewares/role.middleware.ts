import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user || !roles.includes((req as any).user.role)) {
      // if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient Role" });
    }
    next();
  };
};
