import type { Book, BookRepo } from "@/modules/books/core/books.models";
import { ResourceNotFoundError, InvalidExchangeError } from "@/lib/error";
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

/**
 * Rich domain entity responsible for validating and orchestrating
 * a book exchange request before persisting it.
 */
export class ExchangeEntity {
    private status: ExchangeStatus = 'pending';

    constructor(
        private requesterId: string,
        private myBookId: string,
        private targetBookId: string,
    ) {}

    /**
     * Runs all domain validations and persists the exchange if everything passes.
     */
    async request(bookDb: BookRepo, exchangeDb: ExchangeRepo) {
        // Load both books and ensure they exist.
        const myBook: Book | undefined = await bookDb.readOneId(this.myBookId);
        const targetBook: Book | undefined = await bookDb.readOneId(this.targetBookId);

        if (!myBook) throw new ResourceNotFoundError("Livre proposé non trouvé");
        if (!targetBook) throw new ResourceNotFoundError("Le livre demandé n'existe pas");

        // Ensure both books are available for swap.
        if (!myBook.available) throw new InvalidExchangeError("Ce livre n'est pas disponible pour échange");
        if (!targetBook.available) throw new InvalidExchangeError("Le livre demandé n'est pas disponible");

        // Prevent users from exchanging their own books with themselves.
        if(targetBook.owner_id === this.requesterId) {
            throw new InvalidExchangeError("Vous ne pouvez pas échanger un livre avec vous-même");
        }

        // Prevent duplicate pending exchanges with same requester/books combo.
        const existing = await exchangeDb.readOne(this.myBookId, this.targetBookId, this.requesterId);
        if (existing) throw new InvalidExchangeError("Une demande similaire est déjà en attente");

        // Persist the new exchange record.
        const result = await exchangeDb.create({
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
    /**
     * Persists a new exchange row.
     */
    create: (input: Exchange) => Promise<Exchange>;
    readAll: () => Promise<Exchange[]>;
    /**
     * Finds a pending exchange by its unique combination of books/requester.
     * TODO: extend signature to accept status filters when other flows (accept/reject) are implemented.
     */
    readOne: (myBookId: string, targetBookId: string, requesterId: string) => Promise<Exchange | undefined>;
}
