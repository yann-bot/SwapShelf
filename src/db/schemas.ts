
import {sqliteTable as Table, text, integer} from "drizzle-orm/sqlite-core";

export const users = Table("users",{
    id: text('user_id').primaryKey(),
    name: text('user_name').notNull(),
    email: text().notNull(),
    password: text().notNull(),
    role: text().notNull(),
    created_at: integer({ mode: "timestamp" }).notNull(),
})