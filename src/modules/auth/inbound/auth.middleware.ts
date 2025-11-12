
import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../core/auth.service";
import type { User } from "@/modules/users/core/users.models";

export function requireAuth(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    try {
      const token = header.replace(/^Bearer\s+/i, "");
      const user = await authService.verifyToken(token);
      res.locals.user = user;
      next();
    } catch (error) {
      next(error); 
    }
  };
}

export function requireRole(...allowedRoles: User["role"][]) {
    return (_req: Request, res: Response, next: NextFunction) => {
      const user: User | undefined = res.locals.user;
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    };
}