import { DataSource } from 'typeorm';
import { Configuration } from './entities/configuration.entity';

export const configurationProviders = [
  {
    provide: 'CONFIGURATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Configuration),
    inject: ['DATA_SOURCE'],
    exports: ['CONFIGURATION_REPOSITORY'],
  },
];