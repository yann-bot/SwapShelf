import { BookDrizzleRepo } from "./outbound/book.repo";
import { BookService } from "./core/books.service";
import { BookController } from "./inbound/bouks.rest";


const repository = new BookDrizzleRepo();
const service = new BookService(repository);
export const router = BookController(service);