import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { Component } from '../components/entities/component.entity';

@Injectable()
export class ConfigurationService {
  constructor(
  @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  async create(name: string, componentIds: number[]): Promise<Configuration> {
    try {
      const configuration = new Configuration();
      configuration.name = name;
      configuration.components = await this.configurationRepository.manager.findByIds(Component, componentIds);
      return this.configurationRepository.save(configuration);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating configuration: ${error.message}`);
    }
  }

  async findAll(): Promise<Configuration[]> {
    try {
      return await this.configurationRepository.find({ relations: ['components'] });
    } catch (error) {
      throw new InternalServerErrorException(`Error finding all configurations: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Configuration> {
    try {
      const configuration = await this.configurationRepository.findOne({ where: { id }, relations: ['components'] });
      if (!configuration) {
        throw new NotFoundException(`Configuration with ID ${id} not found`);
      }
      return configuration;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding configuration with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.configurationRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting configuration with ID ${id}: ${error.message}`);
    }
  }
}

