import { type SignOptions, type Secret } from "jsonwebtoken";
import type { UserRepo } from "@/modules/users/core/users.models";

export interface jwtPayload {
    id: string,
    email: string,
    role: string
}

export interface AuthDependency {
    userRepo: UserRepo,
    jwtSecret: Secret,
    jwtExpiresIn?: SignOptions["expiresIn"],
}