import { Injectable } from '@nestjs/common';
import { CreateMotherBoardDto } from './dto/create-mother-board.dto';
import { UpdateMotherBoardDto } from './dto/update-mother-board.dto';

@Injectable()
export class MotherBoardService {
  create(createMotherBoardDto: CreateMotherBoardDto) {
    return 'This action adds a new motherBoard';
  }

  findAll() {
    return `This action returns all motherBoard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} motherBoard`;
  }

  update(id: number, updateMotherBoardDto: UpdateMotherBoardDto) {
    return `This action updates a #${id} motherBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} motherBoard`;
  }
}
