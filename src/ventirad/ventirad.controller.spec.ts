import { Test, TestingModule } from '@nestjs/testing';
import { VentiradController } from './ventirad.controller';
import { VentiradService } from './ventirad.service';

describe('VentiradController', () => {
  let controller: VentiradController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VentiradController],
      providers: [VentiradService],
    }).compile();

    controller = module.get<VentiradController>(VentiradController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
