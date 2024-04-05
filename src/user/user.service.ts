import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { IUserRepo } from './interfaces/user-repo.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: IUserRepo,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password)
      .then();

    const user = {
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
    }
    return await this.usersRepository.create(user);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt);
  }
}
