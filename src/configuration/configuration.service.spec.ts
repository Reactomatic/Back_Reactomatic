import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const mockConfigurationRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: 'CONFIGURATION_REPOSITORY',
          useValue: mockConfigurationRepository,
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
