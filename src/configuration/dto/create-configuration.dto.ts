import { Component } from "src/component/entities/component.entity";

export class CreateConfigurationDto {
    id: number;
    name: string;
    price: number | null;
    user_id: number | null;
    processors: Component[];
    motherboards: Component[];
    gpus: Component[];
    ventirads: Component[];
    memorys: Component[];
    storages: Component[];
    externaldevices: Component[];
    cases: Component[];
    powersupplys: Component[];
}
