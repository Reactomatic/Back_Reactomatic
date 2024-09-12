import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return null;
      }
      const passwordMatch = await argon2.verify(user.password, pass);
      if (passwordMatch) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new InternalServerErrorException(`Error validating user: ${error.message}`);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user.id, role: user.role };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new InternalServerErrorException(`Error during login: ${error.message}`);
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.usersService.findByEmail(createUserDto.email);
      if (userExists) {
        throw new UnauthorizedException('User already exists');
      }
      const hashedPassword = await argon2.hash(createUserDto.password);
      createUserDto.password = hashedPassword;
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error during user registration: ${error.message}`);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const resetToken = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
      // send resetToken via email or any other appropriate method
    } catch (error) {
      throw new InternalServerErrorException(`Error during password reset: ${error.message}`);
    }
  }

  async validateOAuthLogin(profile: any) {
    try {
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
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new InternalServerErrorException(`Error validating OAuth login: ${error.message}`);
    }
  }
}
