
import { sqliteTable as Table, text, integer } from "drizzle-orm/sqlite-core";

export const users = Table("users",{
    id: text('user_id').primaryKey(),
    name: text('user_name').notNull(),
    email: text().notNull(),
    password: text().notNull(),
    role: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
})


export const books = Table("books", {
    id: text('book_id').primaryKey(),
    owner_id: text().notNull(),
    title: text('book_title').notNull(),
    description: text().notNull(),
    author: text('book_author').notNull(),
    available: integer('book_available', { mode: "boolean" }).notNull(),
    condition: text().notNull(),
    created_at: integer('book_created_at', { mode: "timestamp" }).notNull(),
})



export const exchanges = Table("exchanges", {
     id: text("exchange_id").primaryKey(),
     requester_id: text().references(() => users.id).notNull(),
     my_book_id: text().references(() => books.id ).notNull(),
     target_book_id: text().references(() => books.id).notNull(),
     status: text('exchange_status').notNull(),
     created_at: integer("exchange_created_at", {mode: "timestamp"}).notNull(),
})

