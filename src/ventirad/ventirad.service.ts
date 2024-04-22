import { Injectable } from '@nestjs/common';
import { CreateVentiradDto } from './dto/create-ventirad.dto';
import { UpdateVentiradDto } from './dto/update-ventirad.dto';

@Injectable()
export class VentiradService {
  create(createVentiradDto: CreateVentiradDto) {
    return 'This action adds a new ventirad';
  }

  findAll() {
    return `This action returns all ventirad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ventirad`;
  }

  update(id: number, updateVentiradDto: UpdateVentiradDto) {
    return `This action updates a #${id} ventirad`;
  }

  remove(id: number) {
    return `This action removes a #${id} ventirad`;
  }
}
