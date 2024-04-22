import { Test, TestingModule } from '@nestjs/testing';
import { VentiradService } from './ventirad.service';

describe('VentiradService', () => {
  let service: VentiradService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VentiradService],
    }).compile();

    service = module.get<VentiradService>(VentiradService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
