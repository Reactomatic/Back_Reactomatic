import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalDeviceDto } from './create-external-device.dto';

export class UpdateExternalDeviceDto extends PartialType(CreateExternalDeviceDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    type: string;
    frequency: string;
}
