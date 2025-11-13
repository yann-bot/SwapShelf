
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



