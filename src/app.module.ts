import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ComponentModule } from './component/component.module';
import ComponentInteractorClass from "./models/componentInteractor.class";
import { ComponentService } from "./services/Component/component.service";

@Module({
  imports: [ConfigurationModule,  ComponentModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: ComponentInteractorClass,
    useClass: ComponentService
  }],
})
export class AppModule {}
