import { Test, TestingModule } from '@nestjs/testing';
import { MotherBoardService } from './mother-board.service';

describe('MotherBoardService', () => {
  let service: MotherBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MotherBoardService],
    }).compile();

    service = module.get<MotherBoardService>(MotherBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
