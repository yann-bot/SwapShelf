import { BookService } from "./core/books.service";
import { BookController } from "./inbound/bouks.rest";
import { BookDrizzleRepo } from "./outbound/book.repo";
import { AuthService } from "../auth/core/auth.service";
import { UserSqliteRepo } from "../users/outbound/users.repo";
import type { AuthDependency } from "../auth/core/auth.models";
import { type Secret } from "jsonwebtoken";

const repository = new BookDrizzleRepo();
const service = new BookService(repository);
const userRepo = new UserSqliteRepo();
const authDep: AuthDependency = {
    userRepo,
    jwtSecret: process.env.JWT_SECRET as Secret,
    jwtExpiresIn: '1h'
};
const authService = new AuthService(authDep);
export const router = BookController(service, authService);