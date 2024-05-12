import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as argon2 from 'argon2';

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

  async login(user: { email: string; password: string }) {
    const userInDb = await this.usersService.findOneByEmail(user.email);
    if (userInDb && (await argon2.verify(userInDb.password, user.password))) {
      return {
        access_token: this.createToken(userInDb),
        refresh_token: this.createRefreshToken(userInDb),
      };
    }
    return null;
  }

  async refresh(userId: number) {
    const userInDb = await this.usersService.findOne(userId);
    if (!userInDb) {
      return null;
    }
    return {
      access_token: this.createToken(userInDb),
      refresh_token: this.createRefreshToken(userInDb),
    };
  }

  private createToken(user: User) {
    const { id, email, role } = user;
    const payload = { sub: id, email, role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private createRefreshToken(user: User) {
    const { id, email, role } = user;
    const payload = { sub: id, email, role };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}