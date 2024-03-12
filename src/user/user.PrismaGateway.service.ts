import {Injectable} from "@nestjs/common";
import {UserService} from "./user.service";

@Injectable()
export class UserPrismaGatewayService implements UserService {
    constructor() {
    }

    findUser(id: number) {
        return {
            id: 1,
            name: "John Doe",
            email: "MeghRosskOuilles@gmail.com"
        }
    }
}