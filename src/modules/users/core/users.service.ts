import type {User, createUserInput, UserRepo} from "./users.models"
import { randomUUID } from 'crypto'
import { ResourceExistsError, ResourceNotFoundError, CreateResourceError } from "@/lib/error";
import bcrypt from 'bcrypt';


export class UserService {
    private db: UserRepo; 

    constructor(repo: UserRepo){
        this.db = repo;
    }

   async createUser(input: createUserInput):Promise<User> {

        const hashedPassword = await bcrypt.hash(input.password, 10)
        const user: User = { 
            id: randomUUID(),
            name: input.name,
            email: input.email,
            password: hashedPassword,
            role: input.role || 'client',
            created_at: new Date()
        }
        
        try {
           const userFound = await this.db.readOneEmail(input.email);
           if(userFound){
             throw new ResourceExistsError(`User with email ${user.email} already exists`)
           }
           
           return  await this.db.create(user)
        } catch(error) {
            if (error instanceof ResourceExistsError) {
                throw error;
              }
            throw new CreateResourceError("Infra failure while creating user");
        } 
    }


    async readByEmail(email: string){
           const result  = await this.db.readOneEmail(email);
           if(result === undefined){
             throw new ResourceNotFoundError(`User with email: ${email} not found`)
           }
           return result;
    }
}