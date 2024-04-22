import { Test, TestingModule } from '@nestjs/testing';
import { ExternalDeviceService } from './external-device.service';

describe('ExternalDeviceService', () => {
  let service: ExternalDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalDeviceService],
    }).compile();

    service = module.get<ExternalDeviceService>(ExternalDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
