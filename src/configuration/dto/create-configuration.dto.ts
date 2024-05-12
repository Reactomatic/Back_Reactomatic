export class CreateConfigurationDto {
    id: number;
    name: string;
    price: number | null;
    user_id: number | null;
    processor_id: number | null;
    motherboard_id: number | null;
    gpu_id: number | null;
    ventirad_id: number | null;
    memory_id: number | null;
    storage_id: number | null;
    externaldevice_id: number | null;
    case_id: number | null;
    powersupply_id: number | null;
}
