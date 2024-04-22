import { PartialType } from '@nestjs/mapped-types';
import { CreatePowerDto } from './create-power.dto';

export class UpdatePowerDto extends PartialType(CreatePowerDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    power: string;
    certification: string;
    dimension: string;
}
