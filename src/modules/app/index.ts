import type {Request, Response} from 'express';
import { Router} from 'express';


const router = Router();

router.get('/', (_req:Request, res:Response)=>{
    res.send('Welcome on my TO DO APP')
})


export default router;