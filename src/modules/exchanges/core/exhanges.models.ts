import type { Book, BookRepo } from "@/modules/books/core/books.models"
import { ResourceNotFoundError, InvalidExchangeError } from "@/lib/error"
import { randomUUID } from "crypto";

export type ExchangeStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export type Exchange = {
    id: string;
    requester_id: string;
    my_book_id: string;
    target_book_id: string;
    status: string;
    created_at: Date;
};

export type CreateExchangeInput = Omit<Exchange, 'id' | 'created_at' | 'status'>;

export class ExchangeEntity {
    private status: ExchangeStatus = 'pending'

    constructor(
        private requesterId: string,
        private myBookId: string,
        private targetBookId: string,

    ) {}

    async request(bookDb: BookRepo, exchangeDb: ExchangeRepo) {
        const myBook: Book | undefined = await bookDb.readOneId(this.myBookId);
        const targetBook: Book | undefined = await bookDb.readOneId(this.targetBookId);

        if (!myBook) throw new ResourceNotFoundError("Livre proposé non trouvé");
        if (!targetBook) throw new ResourceNotFoundError("Le livre demandé n'existe pas");

        if (!myBook.available) throw new InvalidExchangeError("Ce livre n'est pas disponible pour échange");
        if (!targetBook.available) throw new InvalidExchangeError("Le livre demandé n'est pas disponible");


        if(targetBook.owner_id === this.requesterId) {
            throw new InvalidExchangeError("Vous ne pouvez pas échanger un livre avec vous-même")
        }

        const existing = await exchangeDb.readOne(this.myBookId, this.targetBookId, this.requesterId);
        if (existing) throw new InvalidExchangeError("Une demande similaire est déjà en attente");

        const result=  await exchangeDb.create({
            id: randomUUID(),
            requester_id: this.requesterId,
            my_book_id: this.myBookId,
            target_book_id: this.targetBookId, 
            status: this.status,
            created_at: new Date(),
          });

        return result;

    }
}

export interface ExchangeRepo {
    create: (input: Exchange) => Promise<Exchange>
    readAll: () => Promise<Exchange[]>
    readOne: (myBookId: string, targetBookId: string, requesterId: string) => Promise<Exchange | undefined>
}
