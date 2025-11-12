import type { UserRepo, User } from "../core/users.models"
import {db} from '@/db/db';
import { users } from "@/db/schemas";
import {eq} from 'drizzle-orm'


export  class UserSqliteRepo implements UserRepo {
  
    async  create(input: User):Promise<User>{
           const [createdUser] = await db.insert(users).values(input).returning();
           if(!createdUser){
             throw new Error('Failed to create user')
           }
           return createdUser
         }
   
    async readOneEmail(email: string):Promise<User | undefined>{
        const [userFound ]= await db.select().from(users).where(eq(users.email, email))
        return userFound
    }


    // async readOneId(id:string):Promise<User | undefined> {
    //     const [userFound ]= await db.select().from(users).where(eq(users.id, id))
    //     return userFound
    // }
}