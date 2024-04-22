import { PartialType } from '@nestjs/mapped-types';
import { CreateMotherBoardDto } from './create-mother-board.dto';

export class UpdateMotherBoardDto extends PartialType(CreateMotherBoardDto) {
    id: number;
    name: string;
    price: number;
    brand: string;
    socket: string;
    motherboard_format: string;
    memorytype: string;
}
