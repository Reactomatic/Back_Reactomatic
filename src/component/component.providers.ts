import { DataSource } from 'typeorm';
import { Component } from './entities/component.entity';

export const componentProviders = [
  {
    provide: 'COMPONENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Component),
    inject: ['DATA_SOURCE'],
  },
];