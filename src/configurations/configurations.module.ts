import { Module } from '@nestjs/common';
import { ConfigurationService } from './configurations.service';
import { ConfigurationController } from './configurations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from 'src/components/entities/component.entity';
import { Configuration } from './entities/configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration, Component])],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationsModule {}
