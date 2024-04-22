import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { CreateProcessorDto } from './dto/create-processor.dto';
import { UpdateProcessorDto } from './dto/update-processor.dto';

@Controller('processor')
export class ProcessorController {
  constructor(private readonly processorService: ProcessorService) {}

  @Post()
  create(@Body() createProcessorDto: CreateProcessorDto) {
    return this.processorService.create(createProcessorDto);
  }

  @Get()
  findAll() {
    return this.processorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProcessorDto: UpdateProcessorDto) {
    return this.processorService.update(+id, updateProcessorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processorService.remove(+id);
  }
}
