import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const user = req.user;
    // Allow user to retrieve their own profile or if they are an admin
    if (user.id === +id || user.role === UserRole.ADMIN) {
      return this.usersService.findOne(+id);
    } else {
      throw new UnauthorizedException('You can only view your own profile.');
    }
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    // Allow user to update their own profile or if they are an admin
    if (user.id === +id || user.role === UserRole.ADMIN) {
      return this.usersService.update(+id, updateUserDto);
    } else {
      throw new UnauthorizedException('You can only update your own profile.');
    }
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const user = req.user;
    // Allow user to delete their own profile or if they are an admin
    if (user.id === +id || user.role === UserRole.ADMIN) {
      return this.usersService.remove(+id);
    } else {
      throw new UnauthorizedException('You can only delete your own profile.');
    }
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }
}
