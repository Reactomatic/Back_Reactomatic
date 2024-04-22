import { Module } from '@nestjs/common';
import { ExternalDeviceService } from './external-device.service';
import { ExternalDeviceController } from './external-device.controller';

@Module({
  controllers: [ExternalDeviceController],
  providers: [ExternalDeviceService],
})
export class ExternalDeviceModule {}
