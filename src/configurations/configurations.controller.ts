import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConfigurationService } from './configurations.service';
import { Configuration } from './entities/configuration.entity';

@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  create(@Body() body: { name: string; componentIds: number[] }): Promise<Configuration> {
    return this.configurationService.create(body.name, body.componentIds);
  }

  @Get()
  findAll(): Promise<Configuration[]> {
    return this.configurationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Configuration> {
    return this.configurationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.configurationService.remove(id);
  }
}
