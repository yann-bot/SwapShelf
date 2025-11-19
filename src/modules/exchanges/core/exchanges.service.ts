import type { BookRepo } from "@/modules/books/core/books.models";
import { ExchangeEntity, type Exchange, type CreateExchangeInput, type ExchangeRepo } from "./exhanges.models";
import { InvalidExchangeError, ResourceNotFoundError } from "@/lib/error";

/**
 * Application-level orchestrator for exchange related workflows.
 * Keeps controllers thin and ensures all domain logic flows through the entity.
 */
export class ExchangeService {
    private exchangesRepo: ExchangeRepo;
    private booksRepo: BookRepo;

    constructor(bookRepo: BookRepo, exchangeRepo: ExchangeRepo) {
         this.booksRepo = bookRepo;
         this.exchangesRepo = exchangeRepo;
    }

    /**
     * Entry point exposed to the REST layer to request an exchange.
     * TODO: bubble up richer error codes (409 conflict vs 400 bad request) once HTTP layer needs more nuance.
     */
    async requestExchange(input: CreateExchangeInput): Promise<Exchange> {
        // Defensive checks before reaching the entity.
        const myBook = await this.booksRepo.readOneId(input.my_book_id);
        if (!myBook) {
            throw new ResourceNotFoundError("Book not found");
        }
        if (myBook.owner_id !== input.requester_id) {
            throw new InvalidExchangeError("This book is not your");
        }

        const entity = new ExchangeEntity(
          input.requester_id, 
          input.my_book_id, 
          input.target_book_id
        );
        return entity.request(this.booksRepo, this.exchangesRepo);
      }

    /**
     * Fetch a specific exchange by the trio that uniquely identifies it.
     */
    async readOne(myBookId: string, targetBookId: string, requesterId: string): Promise<Exchange | undefined> {
        return await this.exchangesRepo.readOne(myBookId, targetBookId, requesterId);
    }
    
    /**
     * Retrieve all exchanges.
     * TODO: add pagination or filtering once the dataset grows.
     */
    async readAll(): Promise<Exchange[]> {
        return await this.exchangesRepo.readAll();
    }
}