import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    format: string;
    capacity: string;
    dimension: string;
}
