import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException, ImATeapotException } from '@nestjs/common';
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
  ) { }

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
      if(!user.isActive) {
        throw new ImATeapotException('Account desactivate')
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

      const emailContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h2 style="color: #0d6efd;">Bienvenue sur Reactomatic !</h2>
          <p>Merci pour votre inscription. Votre compte a été créé avec succès.</p>
          <p>Si vous n'êtes pas à l'origine de cette inscription, veuillez contacter notre équipe de support immédiatement.</p>
          <p>Merci, <br> L'équipe de Reactomatic</p>
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
          <h2 style="color: #0d6efd;">Réinitialiser votre mot de passe</h2>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
          <p><a style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 18px; font-weight: bold; color: #fff; background-color: #0d6efd; text-decoration: none; border-radius: 5px;" href="${resetLink}">Réinitialiser le mot de passe</a></p>
          <br>
          <p>Si vous ne l'avez pas demandé, vous pouvez ignorer cet e-mail.</p>
          <p>Merci, <br>L'équipe Reactomatic</p>
        </div>
      `;
      await this.mailService.sendEmail(user.email, 'Reset Password', emailContent);
    } catch (error) {
      throw new InternalServerErrorException(`Error during password reset: ${error.message}`);
    }
  }

  async sendSupportEmail( 
    lastName: string,
    firstName: string,
    email: string,
    message: string
  ): Promise<void> {
    try {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Bonjour,</p>
          <p>${firstName} ${lastName} a envoyé un message de support:</p>
          <p>${message}</p>
          <p>Vous pouvez répondre à ${email}</p>
        </div>
      `;

      await this.mailService.sendEmail('contact@reactomatic.fr', 'Nouveau message de support', emailContent);
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi de l'email de support: ${error.message}`);
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
