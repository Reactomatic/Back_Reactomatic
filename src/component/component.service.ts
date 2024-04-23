import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import ComponentInteractorClass from "../models/componentInteractor.class";

@Injectable()
export class ComponentService extends ComponentInteractorClass {
  create(component: CreateComponentDto): void {
  }

  update(type: string, component: CreateComponentDto): void {
    
  }

  delete(type: string, id: number): void {
    
  }
  findOne(type: string, id: number): void {
    
  }
  findAll(type: string) {

  }
}
