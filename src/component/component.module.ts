import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import ComponentInteractorClass from "../models/componentInteractor.class";

@Module({
  controllers: [ComponentController],
  providers: [ComponentService,  {
    provide: ComponentInteractorClass,
    useClass: ComponentService
  }],
})
export class ComponentModule {}
