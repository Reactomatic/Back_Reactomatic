import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { IUserRepo } from './interfaces/user-repo.interface';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

const userServiceFindAllSucessResult: User[] = [
  new User({
    id: 1,
    email: "test1@email.com.br",
  }),
];

const userServiceFindOneSucessResult: User = new User({
  id: 1,
  email: "test1@email.com.br",
});

const userServiceCreateSucessResult = new User({
  id: 1,
  email: "test1@email.com",
})

const createUserDto = {
  name: "Test1",
  lastName: "Test1",
  email: "test1@email.com",
  password: "sosecure"
}

describe('UserService', () => {
  let userService: UserService;
  let userRepo: IUserRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: IUserRepo,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userServiceFindAllSucessResult),
            findOne: jest.fn().mockResolvedValue(userServiceFindOneSucessResult),
            create: jest.fn().mockResolvedValue(userServiceCreateSucessResult),
          }
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<IUserRepo>(IUserRepo)
  });

  describe('UserService', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  })

  describe('UserRepository', () => {
    it('should be defined', () => {
      expect(userRepo).toBeDefined();
    })
  });

  describe('Testing findAll from UserService', () => {
    it('should return a list of users', async () => {
      const result = await userService.findAll();
      expect(result).toEqual(userServiceFindAllSucessResult);
      expect(typeof (result)).toBe('object');
      expect(result.length).toBe(1);
    })
  });

  describe('Testing findOne from UserService', () => {
    it('should return a single user', async () => {
      const id: number = 1;
      const result = await userService.findOne(id);
      expect(result).toEqual(userServiceFindOneSucessResult);
      expect(typeof (result)).toBe('object');
      expect(result.id).toBe(id);
    })
  });

  describe('Testing create function from UserService', () => {
    it('should create a new user', async () => {
      const result = await userService.create(createUserDto);
      expect(result).toEqual(userServiceCreateSucessResult);
      expect(result.email).toEqual(userServiceCreateSucessResult.email);
      expect(result.id).toEqual(userServiceCreateSucessResult.id);
    })
  })

  describe('Testing hashPassword function from UserService', () => {
    it('should return true when compared with given password', async () => {
      const password = "sosecure";
      const userServiceHashPasswordSucessResult = await userService.hashPassword(password);
      const result = await bcrypt.compare(password, userServiceHashPasswordSucessResult);
      expect(result).toBe(true);
    })
  })
});
