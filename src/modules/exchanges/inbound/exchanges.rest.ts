import type { ExchangeService } from '../core/exchanges.service';
import { Router, type Request, type Response } from 'express';
import { requireAuth } from "@/modules/auth/inbound/auth.middleware";
import type { AuthService } from '@/modules/auth/core/auth.service';
import { z } from 'zod';

/**
 * Minimal payload validation. Additional rules live in the service/entity.
 * TODO: enforce UUID format when frontend guarantees UUID inputs.
 */
const createExchangeSchema = z.object({
       my_book_id: z.string(),
       target_book_id: z.string()
});

export function ExchangeController(service: ExchangeService, authService: AuthService):Router {
      const router = Router();

      router.post('/', requireAuth(authService), async (req:Request, res:Response, next) => {
        try {
          const { my_book_id, target_book_id } = createExchangeSchema.parse(req.body);
          const userId = res.locals.user.id;
          
          const exchange = await service.requestExchange({
            requester_id: userId,
            my_book_id,
            target_book_id
          });
          
          res.status(201).json({ exchange });
        } catch (error) {
          next(error);
        }
      });

      return router;
}