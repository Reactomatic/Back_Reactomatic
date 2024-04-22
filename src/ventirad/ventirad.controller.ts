import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentiradService } from './ventirad.service';
import { CreateVentiradDto } from './dto/create-ventirad.dto';
import { UpdateVentiradDto } from './dto/update-ventirad.dto';

@Controller('ventirad')
export class VentiradController {
  constructor(private readonly ventiradService: VentiradService) {}

  @Post()
  create(@Body() createVentiradDto: CreateVentiradDto) {
    return this.ventiradService.create(createVentiradDto);
  }

  @Get()
  findAll() {
    return this.ventiradService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventiradService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentiradDto: UpdateVentiradDto) {
    return this.ventiradService.update(+id, updateVentiradDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventiradService.remove(+id);
  }
}
