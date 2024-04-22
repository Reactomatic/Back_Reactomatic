import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessorDto } from './create-processor.dto';

export class UpdateProcessorDto extends PartialType(CreateProcessorDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    socket: string;
    core: string;
    thread: string;
    frequency: string;
}
