import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(`Error finding all users: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user with ID ${id}: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(`Error finding user with email ${email}: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(`Error removing user with ID ${id}: ${error.message}`);
    }
  }

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create(userDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating user: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.firstName = updateUserDto.firstName;
      user.lastName = updateUserDto.lastName;
      user.email = updateUserDto.email;
      if (updateUserDto.password) {
        user.password = await argon2.hash(updateUserDto.password);
      }
      user.role = updateUserDto.role;

      return this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user with ID ${id}: ${error.message}`);
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: Number(userId) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.firstName = updateProfileDto.firstName;
      user.lastName = updateProfileDto.lastName;
      user.email = updateProfileDto.email;
      if (updateProfileDto.password) {
        user.password = await argon2.hash(updateProfileDto.password);
      }

      return this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating profile for user with ID ${userId}: ${error.message}`);
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { password: hashedPassword });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating password: ${error.message}`);
    }
  }
}
