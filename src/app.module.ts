import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ComponentModule } from './component/component.module';

@Module({
  imports: [ConfigurationModule,  ComponentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
