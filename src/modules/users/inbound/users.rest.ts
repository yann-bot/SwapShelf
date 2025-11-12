

import type { UserService } from "../core/users.service";
import { Router, type Request, type Response } from "express";
import z from "zod";

const createUserSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string(),
    password: z.string().min(8),
    role: z.enum(['client', 'admin'])
});


export default function UserController(service: UserService):Router{
    const router = Router();
  

    router.post('/', async(req: Request, res: Response, next)=> {
        const parsed = createUserSchema.safeParse(req.body);

        if(!parsed.success){
            const message = parsed.error.issues
                             .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                             .join(", ")
            return res.status(400).json({error: message})
        }

        try{
            const user= await service.createUser(parsed.data);
            res.status(201).json({message:'User created', user})
        } catch(error) {
            next(error)
        }
    })


    router.get('/:email', async(req: Request, res: Response, next) => {
        const {email} = req.params
        if(!email){
            return  res.status(400).json({error:'Missing email'})
        }

        try{
           const user = await service.readByEmail(email);
           if(!user) {
               return res.status(404).json({error: `User with email ${email} not found`})
           }
          return res.status(200).json({message:'User found', user})
        } catch(error) {
            next(error)
        }

    })
   
   return router;
}