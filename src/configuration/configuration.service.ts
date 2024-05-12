import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject('CONFIGURATION_REPOSITORY')
    private configurationRepository: Repository<Configuration>,
  ) {}


  create(createConfigurationDto: CreateConfigurationDto) {
    const newConfig = {
      ...createConfigurationDto,
    };
    return this.configurationRepository.save(newConfig);
  }

  findAll() {
    return this.configurationRepository.find();
  }

  findOne(id: number) {
    return this.configurationRepository.findOneBy({ id });

  }

  findByUser(userId: number) {
    return this.configurationRepository.find({ where: { user_id: userId }});
  }

  async update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    await this.configurationRepository.update(id, updateConfigurationDto);
    const updatedConfig = this.configurationRepository.findOneBy({ id });
    return updatedConfig;
  }

  remove(id: number) {
    return this.configurationRepository.delete(id);
  }
}
