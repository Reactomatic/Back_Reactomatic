import { PartialType } from '@nestjs/mapped-types';
import { CreateGpuDto } from './create-gpu.dto';

export class UpdateGpuDto extends PartialType(CreateGpuDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    chipset: string;
    memory: string;
    power: string;
    bus: string;
}
