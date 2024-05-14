import { Test, TestingModule } from '@nestjs/testing';
import { ComponentService } from './component.service';

describe('ComponentService', () => {
  let service: ComponentService;

  beforeEach(async () => {
    const mockComponentRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentService,
        {
          provide: 'COMPONENT_REPOSITORY',
          useValue: mockComponentRepository,
        },
      ],
    }).compile();

    service = module.get<ComponentService>(ComponentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});