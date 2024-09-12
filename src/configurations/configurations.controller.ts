import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ConfigurationService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthenticatedRequest } from '../auth/authenticatedrequest';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  async create(@Body() createConfigurationDto: CreateConfigurationDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.configurationService.create(createConfigurationDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll() {
    return await this.configurationService.findAll();
  }

  @Get('by-user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findConfigurationByUser(@Param('userId') userId: number) {
    return await this.configurationService.findConfigurationByUserId(userId);
  }

  @Get('me')
  async findMyConfiguration(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.configurationService.findMyConfiguration(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.configurationService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async delete(@Param('id') id: number) {
    return await this.configurationService.delete(id);
  }

  @Put('me/:id')
  async updateMyConfiguration(@Param('id') id: number, @Body() updateConfigurationDto: CreateConfigurationDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.configurationService.updateMyConfiguration(userId, id, updateConfigurationDto);
  }

  @Delete('me/:id')
  async deleteMyConfiguration(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return await this.configurationService.deleteMyConfiguration(userId, id);
  }


}