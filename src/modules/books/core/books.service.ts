import { CreateResourceError} from "@/lib/error";
import type { Book, BookRepo, createBookInput } from "./books.models";
import { randomUUID } from "crypto";



export class BookService {
  private readonly db: BookRepo;

  constructor(repository: BookRepo) {
    this.db = repository;
  }

  async createBook(input: createBookInput, ownerId: string): Promise<Book> {

    const book: Book = {
      id: randomUUID(),
      owner_id: ownerId,
      ...input,
      created_at: new Date(),
    };

    try {
      return await this.db.create(book);
    } catch (error) {
      if(error instanceof Error){
        throw error;
      }
      throw new CreateResourceError("An infra error occured while creating a book");
    }
  }


  async readAllByTitle(title: string): Promise<Book[]> {
    const query = title?.trim() ?? "";
    if (!query) {
      const books = this.db.readAll();
      return books;
    }

    const books =  this.db.readAllByTitle(query);
    return books
  }

  async delete(id: string): Promise<boolean> {
      return await this.db.delete(id);
  }

}