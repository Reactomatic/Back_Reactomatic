import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const passwordMatch = await argon2.verify(user.password, pass).catch(e => {
      return false;
    });

    if (passwordMatch) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashedPassword;
    const user = await this.usersService.create(createUserDto);
    const token = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role });
    return {user, access_token: token}
  }
  

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
  }

  async validateOAuthLogin(profile: any) {
    const email = profile.email;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      const createUserDto = new CreateUserDto();
      createUserDto.email = email;
      createUserDto.firstName = profile.firstName;
      createUserDto.lastName = profile.lastName;
      createUserDto.picture = profile.picture;
      createUserDto.password = '';
      user = await this.usersService.create(createUserDto);
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
