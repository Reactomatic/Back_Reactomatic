import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //Admin can get all users
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  //Admin can get a user by id
  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  //Admin can get a user by email
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //Admin can delete a user
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  //User can create an account
  async create(userDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userDto);
    return this.usersRepository.save(user);
  }

  //User can update their account
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    if (updateUserDto.password) {
      user.password = await argon2.hash(updateUserDto.password);
    }

    user.role = updateUserDto.role;
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: Number(userId) });

    if (!user) {
      throw new Error('User not found');
    }
    user.firstName = updateProfileDto.firstName;
    user.lastName = updateProfileDto.lastName;
    user.email = updateProfileDto.email;
    if (updateProfileDto.password) {
      user.password = await argon2.hash(updateProfileDto.password);
    }

    return this.usersRepository.save(user);
  }
}
