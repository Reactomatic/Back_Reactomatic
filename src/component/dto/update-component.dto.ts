import {Component} from "../entities/component.entity";
import {ComponentType} from "../../enum/ComponentType";

export class UpdateComponentDto extends Component {
    id: number;
    type: ComponentType;
    name: string;
    price: number;
    brand: string;
    metadata: {key: string, value: any}[];
}
