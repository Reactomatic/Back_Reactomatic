import { Test, TestingModule } from '@nestjs/testing';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { componentProviders } from './component.providers';

describe('ComponentController', () => {
  let controller: ComponentController;

  beforeEach(async () => {
    const mockComponentRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentController],
      providers: [
        ComponentService,
        {
          provide: 'COMPONENT_REPOSITORY',
          useValue: mockComponentRepository,
        },
      ],
    }).compile();

    controller = module.get<ComponentController>(ComponentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
