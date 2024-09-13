import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { MailService } from '../mails/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
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
      return { access_token: this.jwtService.sign(payload), user };
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

      const user = await this.usersService.create(createUserDto);
      const token = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role });

      // Send confirmation email
      const confirmationLink = `https://reactomatic.fr/confirm-email?token=${token}`;
      const emailContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #0d6efd;">Welcome to Reactomatic!</h2>
          <p>Thank you for registering. Please confirm your email by clicking on the link below:</p>
          <p><a style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 18px; font-weight: bold; color: #fff; background-color: #0d6efd; text-decoration: none; border-radius: 5px;" href="${confirmationLink}">Confirm Email</a></p>
          <br>
          <p>If you did not sign up for this account, you can ignore this email.</p>
          <p>Thanks, <br> The Reactomatic Team</p>
        </div>
      `;

      await this.mailService.sendEmail(user.email, 'Email Confirmation', emailContent);

      return { user, access_token: token };
    } catch (error) {
      throw new InternalServerErrorException(`Error registering user: ${error.message}`);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const resetToken = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });

      // Send reset password email
      const resetLink = `https://reactomatic.fr/reset-password?token=${resetToken}`;
      const emailContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #0d6efd;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click on the link below to choose a new password:</p>
          <p><a style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 18px; font-weight: bold; color: #fff; background-color: #0d6efd; text-decoration: none; border-radius: 5px;" href="${resetLink}">Reset Password</a></p>
          <br>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>Thanks, <br> The Reactomatic Team</p>
        </div>
      `;
      await this.mailService.sendEmail(user.email, 'Reset Password', emailContent);
    } catch (error) {
      throw new InternalServerErrorException(`Error during password reset: ${error.message}`);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const { token, newPassword } = resetPasswordDto;
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await argon2.hash(newPassword);
      await this.usersService.updatePassword(user.id.toString(), hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException(`Error resetting password: ${error.message}`);
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
      return { access_token: this.jwtService.sign(payload), user };
    } catch (error) {
      throw new InternalServerErrorException(`Error validating OAuth login: ${error.message}`);
    }
  }
}
