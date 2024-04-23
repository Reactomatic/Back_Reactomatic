export default abstract class ComponentInteractorClass {
  //create abstract function for a CRUD
  abstract create(type: string): void;
  abstract read(type: string): void;
  abstract update(type: string): void;

  abstract delete(type: string): void;

  //FindOne and Find
  abstract findOne(type: string, id: number): void;
  abstract find(type: string): void;

  //Log

}