import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigurationDto } from './create-configuration.dto';

export class UpdateConfigurationDto extends PartialType(CreateConfigurationDto) {
    id: number;
    name: string;
    price: number;
    user_id: number;
    processor_id: number;
    motherboard_id: number;
    gpu_id: number;
    ventirad_id: number;
    memory_id: number;
    storage_id: number;
    externaldevice_id: number;
    case_id: number;
    powersupply_id: number;
}
