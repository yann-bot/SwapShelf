import type { User, UserRepo } from "@/modules/users/core/users.models";
import bcrypt from 'bcrypt';
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import { InvalidCredentialsError,  InvalidTokenError,  ResourceNotFoundError } from "@/lib/error";
import { verifyJwt } from "@/lib/auth";

interface AuthDependency {
    userRepo: UserRepo,
    jwtSecret: Secret,
    jwtExpiresIn?: SignOptions["expiresIn"],
}


export class AuthService {
    constructor(private deps: AuthDependency){}
    async login(email: string, password: string){
        const user = await this.deps.userRepo.readOneEmail(email);
        if(user === undefined){
            throw new ResourceNotFoundError(`User with enail ${email} doesn't exit`)
        };

        const checkedPassword = await bcrypt.compare(password, user!.password);
        if(!checkedPassword){
            throw new InvalidCredentialsError("Invalid email or password");
        }
        
        const payLoad =  {id: user.id, email: user.email, role: user.role };

        const token = jwt.sign(
            payLoad,
            this.deps.jwtSecret,
            {expiresIn: this.deps.jwtExpiresIn ?? "1h"}
        )
        return  token;
    }

        
    async verifyToken(token: string): Promise<User> {
         const payload = verifyJwt(token);
         const userEmail = payload.email;
         if(!userEmail) {
            throw new InvalidTokenError("Token payload missing user email")
         }

         const user = await this.deps.userRepo.readOneEmail(userEmail);
         if(!user) {
            throw new ResourceNotFoundError(`User with email ${userEmail} not found`)
         }
         return user;
    }
   
   
}