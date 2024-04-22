import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalDeviceDto } from './create-external-device.dto';

export class UpdateExternalDeviceDto extends PartialType(CreateExternalDeviceDto) {}
