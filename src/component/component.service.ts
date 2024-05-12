import { Injectable, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ComponentType } from '../enum/ComponentType';
import { Component } from './entities/component.entity';
import ComponentInteractorClass from '../models/componentInteractor.class';

@Injectable()
export class ComponentService extends ComponentInteractorClass {

  constructor(
    @Inject('COMPONENT_REPOSITORY')
    private componentRepository: Repository<Component>,
  ) {
    super();
  }

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

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    const newComponent = this.componentRepository.create(createComponentDto);
    Logger.log("New Component: " + JSON.stringify(newComponent));
    if (!this.validateMetadata(newComponent.type, newComponent.metadata)) {
      throw new BadRequestException('Invalid metadata for this type of component.');
    }
    return this.componentRepository.save(newComponent);
  }

  async update(type: ComponentType, id: number, updateComponentDto: UpdateComponentDto): Promise<Component> {
    if (updateComponentDto.metadata && !this.validateMetadata(type, updateComponentDto.metadata)) {
      throw new BadRequestException('Invalid metadata for this type of component.');
    }
    await this.componentRepository.update(id, updateComponentDto);
    return this.componentRepository.findOneBy({id});
  }
  

  async delete(type: ComponentType, id: number): Promise<void> {
    const result = await this.componentRepository.delete({ id, type });
    if (result.affected === 0) {
      throw new NotFoundException('Component not found.');
    }
  }

  async findOne(type: ComponentType, id: number): Promise<Component> {
    const component = await this.componentRepository.findOneBy({ id, type });
    if (!component) {
      throw new NotFoundException('Component not found.');
    }
    return component;
  }

  async findAll(type: ComponentType): Promise<Component[]> {
    return this.componentRepository.findBy({ type });
  }

  validateMetadata(type: ComponentType, metadata: { key: string; value: any }[]): boolean {

    if (!Array.isArray(metadata)) {
      Logger.log(metadata);
      metadata = JSON.parse(metadata);
      throw new BadRequestException('Les métadonnées doivent être un tableau.');
    }

    const expectedMetadataKeys = ComponentService.getExpectedMetadata(type);
    const providedMetadataKeys = metadata.map(item => item.key);

    Logger.log("Expected Metadata Keys: " + JSON.stringify(ComponentService.getExpectedMetadata(type)));
    Logger.log("Provided Metadata Keys: " + JSON.stringify(metadata.map(item => item.key)));  

    const isValid = expectedMetadataKeys.length === providedMetadataKeys.length &&
        expectedMetadataKeys.every(key => providedMetadataKeys.includes(key)) &&
        providedMetadataKeys.every(key => expectedMetadataKeys.includes(key));
    if (!isValid) {
      throw new BadRequestException('Les clés des métadonnées fournies ne correspondent pas exactement aux clés attendues.');
    }

    return true;
  }
  
  static getExpectedMetadata(type: ComponentType): string[] {
    return ComponentService.DICO[type] || [];
  }
}