import {Injectable} from "@nestjs/common";
import ComponentInteractorClass from "../../models/componentInteractor.class";

@Injectable()

export class ComponentService extends ComponentInteractorClass{

  create(type:string) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  read(type:string) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  update(type:string) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  delete(type:string) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  find(type:string) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  findOne(type:string, id:number) {
    //Ici on fait le code : Exemple typeorm.find.machin mais je sais pas comment ca fonctionne
  }

  //Log

}