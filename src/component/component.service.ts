import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import ComponentInteractorClass from "../models/componentInteractor.class";

@Injectable()
export class ComponentService extends ComponentInteractorClass {
  create(type: string): void {
    
  }
  update(type: string): void {
    
  }
  findOne(type: string, id: number): void {
    
  }
  read(type: string): void {
    
  }
  delete(type: string): void {
    
  }
  find(type: string): void {
    
  }
  remove(id: number) {
    
  }
}
