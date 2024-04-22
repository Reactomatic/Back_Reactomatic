import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExternalDeviceService } from './external-device.service';
import { CreateExternalDeviceDto } from './dto/create-external-device.dto';
import { UpdateExternalDeviceDto } from './dto/update-external-device.dto';

@Controller('external-device')
export class ExternalDeviceController {
  constructor(private readonly externalDeviceService: ExternalDeviceService) {}

  @Post()
  create(@Body() createExternalDeviceDto: CreateExternalDeviceDto) {
    return this.externalDeviceService.create(createExternalDeviceDto);
  }

  @Get()
  findAll() {
    return this.externalDeviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.externalDeviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExternalDeviceDto: UpdateExternalDeviceDto) {
    return this.externalDeviceService.update(+id, updateExternalDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalDeviceService.remove(+id);
  }
}
