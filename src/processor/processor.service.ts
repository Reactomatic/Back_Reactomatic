import { Injectable } from '@nestjs/common';
import { CreateProcessorDto } from './dto/create-processor.dto';
import { UpdateProcessorDto } from './dto/update-processor.dto';

@Injectable()
export class ProcessorService {
  create(createProcessorDto: CreateProcessorDto) {
    return 'This action adds a new processor';
  }

  findAll() {
    return `This action returns all processor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} processor`;
  }

  update(id: number, updateProcessorDto: UpdateProcessorDto) {
    return `This action updates a #${id} processor`;
  }

  remove(id: number) {
    return `This action removes a #${id} processor`;
  }
}
