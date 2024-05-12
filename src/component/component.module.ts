import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { Component } from './entities/component.entity';
import { componentProviders } from './component.providers';
import { DatabaseModule } from 'database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ComponentController],
  providers: [
    ComponentService,
    ...componentProviders,
  ],
})
export class ComponentModule {}