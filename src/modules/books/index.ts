import { BookService } from "./core/books.service";
import { BookController } from "./inbound/books.rest";
import { BookDrizzleRepo } from "./outbound/book.repo";
import { service as AuthService } from "@/modules/auth/index";

export const repository = new BookDrizzleRepo();
const service = new BookService(repository);
export const router = BookController(service, AuthService);