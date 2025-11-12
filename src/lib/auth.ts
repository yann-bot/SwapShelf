import type { jwtPayload } from "@/modules/auth/core/auth.models";
import jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";

export function verifyJwt(token: string): jwtPayload {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice("Bearer ".length);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded as JwtPayload & jwtPayload;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw error;
    }
    throw new JsonWebTokenError("Invalid or expired token");
  }
}