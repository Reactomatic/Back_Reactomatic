import { PartialType } from '@nestjs/mapped-types';
import { CreateMotherBoardDto } from './create-mother-board.dto';

export class UpdateMotherBoardDto extends PartialType(CreateMotherBoardDto) {}
