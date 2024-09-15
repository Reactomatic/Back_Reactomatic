import {
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { User } from '../users/entities/user.entity';
import { Component } from '../components/entities/component.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  async create(createConfigurationDto: CreateConfigurationDto, userId: number): Promise<Configuration> {
    try {
      const { name, componentIds } = createConfigurationDto;

      // Charger les composants à partir de la base de données
      const components = await this.componentRepository.findByIds(componentIds);

      if (components.length !== componentIds.length) {
        throw new HttpException('One or more components not found', 400);
      }

      const configuration = new Configuration();
      configuration.name = name;
      configuration.user = { id: userId } as any;
      configuration.components = components;

      return await this.configurationRepository.save(configuration);
    } catch (error) {
      throw new HttpException('Error creating configuration', 500);
    }
  }

  async findAll(): Promise<Configuration[]> {
    try {
      return await this.configurationRepository.find();
    } catch (error) {
      throw new HttpException('Error finding all configurations', 500);
    }
  }

  async findOne(id: number): Promise<Configuration> {
    try {
      const config = await this.configurationRepository.findOne({ where: { id }, relations: ['components'] });
      if (!config) {
        throw new HttpException(`Configuration with id ${id} not found`, 404);
      }
      return config;
    } catch (error) {
      throw new HttpException('Error finding configuration', 500);
    }
  }

  async findConfigurationByUserId(userId: number): Promise<Configuration[]> {
    try {
      return await this.configurationRepository.find({ where: { user: { id: userId } }, relations: ['components'] });
    } catch (error) {
      throw new HttpException('Error finding configurations for user', 500);
    }
  }

  async findMyConfiguration(userId: number): Promise<Configuration[]> {
    try {
      return await this.findConfigurationByUserId(userId);
    } catch (error) {
      throw new HttpException('Error finding your configurations', 500);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.configurationRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException(`Configuration with id ${id} not found`, 404);
      }
    } catch (error) {
      throw new HttpException('Error deleting configuration', 500);
    }
  }

  async updateMyConfiguration(userId: number, configId: number, updateConfigurationDto: CreateConfigurationDto): Promise<Configuration> {
    try {
      const configuration = await this.configurationRepository.findOne({ where: { id: configId, user: { id: userId } } });

      if (!configuration) {
        throw new NotFoundException(`Configuration with id ${configId} for user ${userId} not found`);
      }

      const { name, componentIds } = updateConfigurationDto;

      const components = await this.componentRepository.findByIds(componentIds);

      if (components.length !== componentIds.length) {
        throw new HttpException('One or more components not found', 400);
      }

      configuration.name = name;
      configuration.components = components;

      return await this.configurationRepository.save(configuration);
    } catch (error) {
      throw new HttpException('Error updating configuration', 500);
    }
  }

  async deleteMyConfiguration(userId: number, configId: number): Promise<void> {
    try {
      const configuration = await this.configurationRepository.findOne({ where: { id: configId, user: { id: userId } } });

      if (!configuration) {
        throw new NotFoundException(`Configuration with id ${configId} for user ${userId} not found`);
      }

      await this.configurationRepository.remove(configuration);
    } catch (error) {
      throw new HttpException('Error deleting configuration', 500);
    }
  }
}
