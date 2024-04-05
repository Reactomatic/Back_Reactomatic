import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { IUserRepo } from "./interfaces/user-repo.interface";

@Injectable()
export class UserRepo implements IUserRepo {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find(
            {
                select: ['id', 'email'],
            }
        );
    }

    async findOne(id: number): Promise<User> {
        return await this.usersRepository.findOne({
            select: ['id', 'email'],
            where: [{ id: id }],
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(createUserDto);
    }
}


