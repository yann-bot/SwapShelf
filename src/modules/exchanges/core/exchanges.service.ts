import type { BookRepo } from "@/modules/books/core/books.models";
import { ExchangeEntity, type Exchange, type CreateExchangeInput, type ExchangeRepo } from "./exhanges.models";





export  class ExchangeService {
    private exchangesRepo: ExchangeRepo;
    private booksRepo: BookRepo;

    constructor(repo1: BookRepo, repo2: ExchangeRepo) {
         this.booksRepo = repo1;
         this.exchangesRepo = repo2

    }

    async requestExchange(input: CreateExchangeInput):Promise<Exchange> {
        const entity  =  new ExchangeEntity(input.requester_id, input.my_book_id, input.target_book_id)
        return entity.request(this.booksRepo, this.exchangesRepo)
    }

    async readOne(myBookId: string, targetBookId: string, requesterId: string): Promise<Exchange | undefined> {
        return await this.exchangesRepo.readOne(myBookId, targetBookId, requesterId);
    }
    
    async readAll(): Promise<Exchange[]> {
        return await this.exchangesRepo.readAll();
    }
}