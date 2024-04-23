import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Controller('component')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentService.create(createComponentDto);
  }

  @Get(':type')
  findAll(@Param('type') type: string) {
    return this.componentService.findAll(type);
  }

  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string){
    return this.componentService.findOne(type, +id);
  }

  @Patch(':id')
  update(@Param('type') type: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentService.update(type, updateComponentDto );
  }

  @Delete(':type/:id')
  delete(@Param('type') type: string,  @Param('id') id: string) {
    return this.componentService.delete(type, +id);
  }
}
