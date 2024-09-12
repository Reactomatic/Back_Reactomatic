import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './configurations.service';
import { ConfigurationController } from './configurations.controller';
import { Configuration } from './entities/configuration.entity';
import { User } from '../users/entities/user.entity';
import { Component } from '../components/entities/component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration, User, Component])],
  providers: [ConfigurationService],
  controllers: [ConfigurationController],
})
export class ConfigurationModule {}