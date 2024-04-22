import { PartialType } from '@nestjs/mapped-types';
import { CreateVentiradDto } from './create-ventirad.dto';

export class UpdateVentiradDto extends PartialType(CreateVentiradDto) {}
