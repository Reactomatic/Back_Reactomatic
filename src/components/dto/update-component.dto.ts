import { PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';
import { ComponentType } from 'src/enum/componentsType';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
    id: number;
    category: ComponentType;
    name: string;
    price: number;
    brand: string;
    metadata?: {key: string, value: any}[];
    priceByRetailer?: { retailer: string; price: number; url: string }[];
}
