import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as argon2 from 'argon2';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(user: User) {
    const hashedPassword = await argon2.hash(user.password);
    const newUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    const { password, ...result } = newUser;
    return result;
  }

  async login(user: Auth) {
    const userInDb = await this.usersService.findOneByEmail(user.email);
    if (userInDb && (await argon2.verify(userInDb.password, user.password))) {
      const { password, ...result } = userInDb;
      return {
        ...result,
        access_token: this.jwtService.sign(result),
      };
    }
    return null;
  }
}