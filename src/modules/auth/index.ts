import { repo } from "../users/index";
import { AuthService } from "./core/auth.service";
import { AuthController } from "./inbound/auth.rest";
import { type Secret } from "jsonwebtoken";
import type { AuthDependency } from "./core/auth.models";

const authDep: AuthDependency = {
    userRepo : repo,
    jwtSecret: process.env.JWT_SECRET as Secret,
    jwtExpiresIn: '1h'
}


const service = new AuthService(authDep);
export const router = AuthController(service);