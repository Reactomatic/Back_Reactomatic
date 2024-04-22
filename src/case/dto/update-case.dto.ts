import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseDto } from './create-case.dto';

export class UpdateCaseDto extends PartialType(CreateCaseDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    frametype: string;
    dimension: string;
    motherboardformat: string;
    gpu_size: string;
    powersupply_size: string;
}
