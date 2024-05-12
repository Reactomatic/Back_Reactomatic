import { UpdateComponentDto } from "src/component/dto/update-component.dto";
import { CreateComponentDto } from "../component/dto/create-component.dto";
export default abstract class ComponentInteractorClass {
  //create abstract function for a CRUD

  abstract create(component: CreateComponentDto): void;
  abstract update(type: string, id: number, component: UpdateComponentDto): void;

  abstract delete(type: string, id: number): void;

  //FindOne and Find
  abstract findOne(type: string, id: number ): void;
  abstract findAll(type: string): void;

  //Log

}