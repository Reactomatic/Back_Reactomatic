import { ComponentType } from "src/enum/componentsType";
import { Component } from "../entities/component.entity";

export class CreateComponentDto extends Component {
    id: number;
    category: ComponentType;
    name: string;
    price: number;
    brand: string;
    metadata?: {key: string, value: any}[];
    priceByRetailer?: {retailer: string, price: number, url: string}[];
}
