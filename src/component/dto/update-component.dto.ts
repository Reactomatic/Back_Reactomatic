import { PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
  id: number;
  name: string;
  price: number;
  brand: string;
  power?: string;
  certification?: string;
  dimension?: string;
  frametype?: string;
  motherboardformat?: string;
  gpu_size?: string;
  powersupply_size?: string;
  type?: string;
  frequency?: string;
  chipset?: string;
  memory?: string;
  bus?: string;
  memorytype?: string;
  capacity?: string;
  latency?: string;
  socket?: string;
  motherboard_format?: string;
  core?: string;
  thread?: string;
  fan_size?: string;
  socket_support?: string;
  sound_level?: string;
  speed?: string;
}
