import type { ExchangeService } from '../core/exchanges.service';
import { Router, type Request, type Response } from 'express';
import { requireAuth } from "@/modules/auth/inbound/auth.middleware";
import { AuthService } from '@/modules/auth/core/auth.service';


export function ExchangeController(service: ExchangeService, authService: AuthService):Router {
      const router = Router();

      router.post('/', requireAuth(authService), async (req: Request, res: Response) => {
          const  input = req.body;
          const exchange = await service.requestExchange(input);
          res.status(201).json({message: 'exchange created', exchange})
      })

     

      return router;
}