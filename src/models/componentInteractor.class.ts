import { CreateComponentDto } from "../component/dto/create-component.dto";
export default abstract class ComponentInteractorClass {
  //create abstract function for a CRUD

  abstract create(component: CreateComponentDto): void;
  abstract update(type: string, component: CreateComponentDto): void;

  abstract delete(type: string, id: number): void;

  //FindOne and Find
  abstract findOne(type: string, id: number ): void;
  abstract findAll(type: string): void;

  //Log

}