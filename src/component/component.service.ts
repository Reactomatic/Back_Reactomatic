import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentType } from "../enum/ComponentType";
import { Component } from "./entities/component.entity";
import ComponentInteractorClass from "../models/componentInteractor.class";

@Injectable()
export class ComponentService extends ComponentInteractorClass {
  private components: Component[] = [];

  private static DICO: Record<ComponentType, string[]> = {
    [ComponentType.PROCESSOR]: ["freq", "tdp", "socket"],
    [ComponentType.MOTHERBOARD]: ["socket", "ramSlots", "formFactor"],
    [ComponentType.GPU]: ["ram", "gpuClock"],
    [ComponentType.VENTIRAD]: ["fanSize", "maxTDP"],
    [ComponentType.MEMORY]: ["capacity", "type"],
    [ComponentType.STORAGE]: ["capacity", "interface", "formFactor"],
    [ComponentType.EXTERNALDEVICE]: ["interface", "capacity"],
    [ComponentType.CASE]: ["formFactor", "maxGPULength"],
    [ComponentType.POWERSUPPLY]: ["wattage", "efficiency"],
  };

  create(component: CreateComponentDto): Component {
    const newComponent = new Component(component);
    if (!this.validateMetadata(newComponent.type, newComponent.metadata)) {
      throw new BadRequestException('Les métadonnées fournies ne correspondent pas aux métadonnées attendues pour ce type de composant.');
    }
    this.components.push(newComponent);
    return newComponent;
  }

  update(type: ComponentType, updateComponentDto: UpdateComponentDto): Component {
    const componentToUpdate = this.findOne(type, updateComponentDto.id);

    if (updateComponentDto.name !== undefined) {
      componentToUpdate.name = updateComponentDto.name;
    }
    if (updateComponentDto.price !== undefined) {
      componentToUpdate.price = updateComponentDto.price;
    }
    if (updateComponentDto.brand !== undefined) {
      componentToUpdate.brand = updateComponentDto.brand;
    }
    if (updateComponentDto.metadata !== undefined) {
      componentToUpdate.metadata = updateComponentDto.metadata;
    }

    return componentToUpdate;
  }

  delete(type: ComponentType, id: number): void {
    const index = this.components.findIndex(component => component.id === id && component.type === type);
    if (index === -1) {
      throw new NotFoundException('Composant introuvable');
    }
    this.components.splice(index, 1);
  }

  findOne(type: ComponentType, id: number): Component {
    const component = this.components.find(component => component.id === id && component.type === type);
    if (!component) {
      throw new NotFoundException('Composant introuvable');
    }
    return component;
  }

  findAll(type: ComponentType): Component[] {
    return this.components.filter(component => component.type === type);
  }

  static getExpectedMetadata(type: ComponentType): string[] {
    return ComponentService.DICO[type] || [];
  }

  validateMetadata(type: ComponentType, metadata: { key: string; value: any }[]): boolean {
    const expectedMetadata = ComponentService.getExpectedMetadata(type);
    const providedMetadataKeys = metadata.map(item => item.key);
    return expectedMetadata.every(key => providedMetadataKeys.includes(key));
  }
}
