import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";

export abstract class IUserService {
    abstract findAll(): Promise<User[]>
    abstract findOne(id: number): Promise<User>
    abstract create(CreateUserDto: CreateUserDto): Promise<User>
}
