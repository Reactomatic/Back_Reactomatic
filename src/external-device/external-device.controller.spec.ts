import { Test, TestingModule } from '@nestjs/testing';
import { ExternalDeviceController } from './external-device.controller';
import { ExternalDeviceService } from './external-device.service';

describe('ExternalDeviceController', () => {
  let controller: ExternalDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalDeviceController],
      providers: [ExternalDeviceService],
    }).compile();

    controller = module.get<ExternalDeviceController>(ExternalDeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
