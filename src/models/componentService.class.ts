export default abstract class ComponentService {
  //create abstract function for a CRUD
  abstract create(): void;
  abstract read(): void;
  abstract update(): void;
  abstract delete(): void;

  //FindOne and Find
  abstract findOne(id: number): void;
  abstract find(): void;

  //Log

}