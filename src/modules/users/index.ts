import { UserService } from "./core/users.service";
import { UserSqliteRepo} from "./outbound/users.repo";
import UserController from "./inbound/users.rest";


export const repo = new UserSqliteRepo();
const service = new UserService(repo);
export const router = UserController(service);

