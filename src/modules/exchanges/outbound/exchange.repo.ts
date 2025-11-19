import type { Exchange, ExchangeRepo } from "../core/exhanges.models";
import { db }  from '@/db/db';
import { exchanges } from "@/db/schemas";
import { eq, and } from "drizzle-orm";



export  class ExchangeDrizzleRepo implements ExchangeRepo {
    /**
     * Inserts a new exchange row and returns the persisted record.
     */
    async create(input: Exchange): Promise<Exchange> {
        const [result] =  await db.insert(exchanges).values(input).returning();
        return result!
    }

    async readAll():Promise<Exchange[]>{
        // NOTE: currently returns every row; add pagination when data grows.
        const result = await db.select().from(exchanges);
        return result;

    }

    async readOne(myBookId: string,
                  targetBookId:string, 
                  requesterId:string
                ):Promise<Exchange>
                {
         const [result] = await db.select()
                                  .from(exchanges)
                                  .where(
                                   and(
                                     eq(exchanges.my_book_id, myBookId),
                                     eq(exchanges.target_book_id, targetBookId),
                                     eq(exchanges.requester_id, requesterId)
                                   ) 
                                );
         return result!

    }

}