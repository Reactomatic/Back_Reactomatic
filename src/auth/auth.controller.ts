import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.validateOAuthLogin(req.user);
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateUserDto) {
    const userId = req.user['userId'];
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

}