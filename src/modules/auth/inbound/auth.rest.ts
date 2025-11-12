
import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { AuthService } from "../core/auth.service";

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export function AuthController(service: AuthService): Router {
  const router = Router();

  router.post("/login",async (req: Request, res: Response, next: NextFunction) => {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        const message = parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");

        return res.status(400).json({ error: message });
      }

      try {
        const { email, password } = parsed.data;
        const token = await service.login(email, password);

        return res.status(200).json({ message: "Authenticated", token });
      } catch (error) {
        next(error);
      }
    },
  );




  return router;
}