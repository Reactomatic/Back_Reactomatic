import { PartialType } from '@nestjs/mapped-types';
import { CreateMemoryDto } from './create-memory.dto';

export class UpdateMemoryDto extends PartialType(CreateMemoryDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    memorytype: string;
    capacity: string;
    frequency: string;
    latency: string;
}
