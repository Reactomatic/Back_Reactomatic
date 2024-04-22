import { Test, TestingModule } from '@nestjs/testing';
import { MotherBoardController } from './mother-board.controller';
import { MotherBoardService } from './mother-board.service';

describe('MotherBoardController', () => {
  let controller: MotherBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotherBoardController],
      providers: [MotherBoardService],
    }).compile();

    controller = module.get<MotherBoardController>(MotherBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
