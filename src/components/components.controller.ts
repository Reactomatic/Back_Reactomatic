import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { ComponentType } from 'src/enum/componentsType';
import { SearchPriceDto } from './dto/search-price.dto';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) { }

  @Get()
  findAll() {
    return this.componentsService.findAll();
    //return this.componentsService.updatePrices();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentsService.findOne(+id);
  }

  @Get(':category')
  findByCategory(@Param('category') category: ComponentType) {
    return this.componentsService.findByCategory(category);
  }



  @Post(':id/search')
  searchPriceByName(@Param('id') id: string, @Body() name: string) {
    return this.componentsService.searchPricesByName(+id, name);
    //return this.componentsService.updatePrices();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentsService.update(+id, updateComponentDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.componentsService.remove(+id);
  }
}
