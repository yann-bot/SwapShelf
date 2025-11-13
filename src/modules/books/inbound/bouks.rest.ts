import {Router, type Request, type Response } from "express";
import type { BookService } from "../core/books.service";
import { z } from "zod";

const createBookSchema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    description: z.string().trim().min(1),
    author: z.string().min(1, "L’auteur est obligatoire"),
    available: z.boolean(),
    condition: z.enum(["neuf", "bon", "use"]),
  });
  




export function BookController(service: BookService):Router{
         const router = Router();
         
         router.post("/", async(req:Request, res:Response, next)=>{
            try {
                const parsed = createBookSchema.parse(req.body);
                const ownerId = res.locals.user.id;
                const book = await service.createBook(parsed, ownerId);
                res.status(201).json({ book });
            } catch (error) {
                next(error);
            }
         })


         router.get('/:title', async(req:Request, res:Response, next)=>{
              try{
                const title = req.params.title?.trim() || '';
                const books = await service.readAllByTitle(title);
                res.status(200).json({ books });
              } catch(error) {
                next(error)
              }
         })


      



         return router;
}