// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Assurez-vous que le chemin d'import est correct.

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {};
    const mockJwtService = {
      sign: jest.fn(),
    };
    const mockUserService = {
      findUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});