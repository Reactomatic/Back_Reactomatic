import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { DatabaseModule } from 'database/database.module'; 
import { configurationProviders } from './configuration.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ConfigurationController],
  providers: [
    ...configurationProviders,
    ConfigurationService,
  ],
})
export class ConfigurationModule {}
