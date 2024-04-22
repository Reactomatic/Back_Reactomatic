import { Injectable } from '@nestjs/common';
import { CreateExternalDeviceDto } from './dto/create-external-device.dto';
import { UpdateExternalDeviceDto } from './dto/update-external-device.dto';

@Injectable()
export class ExternalDeviceService {
  create(createExternalDeviceDto: CreateExternalDeviceDto) {
    return 'This action adds a new externalDevice';
  }

  findAll() {
    return `This action returns all externalDevice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} externalDevice`;
  }

  update(id: number, updateExternalDeviceDto: UpdateExternalDeviceDto) {
    return `This action updates a #${id} externalDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} externalDevice`;
  }
}
