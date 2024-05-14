import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationController', () => {
  let controller: ConfigurationController;

  beforeEach(async () => {
    const mockConfigurationRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigurationController],
      providers: [
        ConfigurationService,
        {
          provide: 'CONFIGURATION_REPOSITORY',
          useValue: mockConfigurationRepository,
        },
      ],
    }).compile();

    controller = module.get<ConfigurationController>(ConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
