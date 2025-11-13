import { db } from "@/db/db";
import { books } from "@/db/schemas";
import type { Book, BookRepo } from "../core/books.models";
import { eq, like } from "drizzle-orm";



export class BookDrizzleRepo implements BookRepo {
      async create(input: Book):Promise<Book> {
            const [createdBook] = await db.insert(books).values(input).returning()
            if(!createdBook){
              throw new Error(" Repo fail to create user")
            }
            return createdBook
      }

      async readAllByTitle(title: string):Promise<Book[]>{
          const foundBooks = await db.select().from(books).where(like(books.title,  `%${title.trim()}%` ))
          return foundBooks;
      }

      async readAll():Promise<Book[]> {
        const foundBooks = await db.select().from(books);
        return foundBooks;
      }

    async readOneId(id: string):Promise<Book>{
        const [foundBook] = await db.select().from(books).where(eq(books.id, id))
        if(!foundBook){
            throw new Error("books not found")
        }
        return foundBook
    }

    async delete(id: string):Promise<boolean> {
       const deleted = await db.delete(books).where(eq(books.id, id)).run();
       return deleted.rowsAffected > 0;
    }
}
