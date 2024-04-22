import { PartialType } from '@nestjs/mapped-types';
import { CreateVentiradDto } from './create-ventirad.dto';

export class UpdateVentiradDto extends PartialType(CreateVentiradDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    fan_size: string;
    socket_support: string;
    sound_level: string;
    speed: string;
}
