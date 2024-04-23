import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProcessorModule } from './processor/processor.module';
import { VentiradModule } from './ventirad/ventirad.module';
import { ExternalDeviceModule } from './external-device/external-device.module';
import { MotherBoardModule } from './mother-board/mother-board.module';
import { MemoryModule } from './memory/memory.module';
import { CaseModule } from './case/case.module';
import { GpuModule } from './gpu/gpu.module';
import { StorageModule } from './storage/storage.module';
import { PowerModule } from './power/power.module';
import { ComponentModule } from './component/component.module';
import ComponentInteractorClass from "./models/componentInteractor.class";
import { ComponentService } from "./services/Component/component.service";

@Module({
  imports: [ConfigurationModule, ProcessorModule, VentiradModule, ExternalDeviceModule, MotherBoardModule, MemoryModule, CaseModule, GpuModule, StorageModule, PowerModule, ComponentModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: ComponentInteractorClass,
    useClass: ComponentService
  }],
})
export class AppModule {}
