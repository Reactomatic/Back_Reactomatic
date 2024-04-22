import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MotherBoardService } from './mother-board.service';
import { CreateMotherBoardDto } from './dto/create-mother-board.dto';
import { UpdateMotherBoardDto } from './dto/update-mother-board.dto';

@Controller('mother-board')
export class MotherBoardController {
  constructor(private readonly motherBoardService: MotherBoardService) {}

  @Post()
  create(@Body() createMotherBoardDto: CreateMotherBoardDto) {
    return this.motherBoardService.create(createMotherBoardDto);
  }

  @Get()
  findAll() {
    return this.motherBoardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motherBoardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMotherBoardDto: UpdateMotherBoardDto) {
    return this.motherBoardService.update(+id, updateMotherBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motherBoardService.remove(+id);
  }
}
