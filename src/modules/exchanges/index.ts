import { ExchangeDrizzleRepo } from "./outbound/exchange.repo";
import { ExchangeService } from "./core/exchanges.service";
import { ExchangeController} from "./inbound/exchanges.rest";
import {repository as bookRepo}  from '@/modules/books/index'
import { service as AuthService } from "@/modules/auth/index";


const exchangeRepo = new ExchangeDrizzleRepo();
const service = new ExchangeService(bookRepo, exchangeRepo);
export const router = ExchangeController(service, AuthService);