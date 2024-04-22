import { Module } from '@nestjs/common';
import { MotherBoardService } from './mother-board.service';
import { MotherBoardController } from './mother-board.controller';

@Module({
  controllers: [MotherBoardController],
  providers: [MotherBoardService],
})
export class MotherBoardModule {}
