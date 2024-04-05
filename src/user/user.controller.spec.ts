import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/user-service.interface';
import { UserController } from './user.controller';

const userControllerFindAllSucessResult: User[] = [
  new User({
    id: 1,
    email: "test1@email.com.br",
  }),
];

const userControllerFindOneSucessResult: User = new User({
  id: 1,
  email: "test1@email.com.br",
})

const userControllerCreateSucessResult = new User({
  id: 1,
  email: "test1@email.com",
})

const createUserDto: CreateUserDto = {
  name: "Test1",
  lastName: "Test1",
  email: "test1@email.com",
  password: "sosecure"
}

describe('UserController', () => {
  let userController: UserController;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: IUserService,
        useValue: {
          findAll: jest.fn().mockResolvedValue(userControllerFindAllSucessResult),
          findOne: jest.fn().mockResolvedValue(userControllerFindOneSucessResult),
          create: jest.fn().mockResolvedValue(userControllerCreateSucessResult),
        },
      }]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<IUserService>(IUserService);
  });

  describe('UserController', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined();
    });
  })

  describe('UserService', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  })

  describe('Testing findAll function from UserController', () => {
    it('should return a list of users', async () => {
      const result = await userController.findAll();
      expect(userService.findAll).toBeCalled();
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userControllerFindAllSucessResult);
      expect(typeof (result)).toBe('object');
      expect(result.length).toBe(1);
    })
  });

  describe('Testing findOne function from UserController', () => {
    it('should return a single user', async () => {
      const result = await userController.findOne(userControllerFindOneSucessResult.id);
      expect(userService.findOne).toBeCalled();
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userControllerFindOneSucessResult);
      expect(result.id).toEqual(userControllerFindOneSucessResult.id);
    })
  });

  describe('Testing create function from UserController', () => {
    it('should create a new user', async () => {
      const result = await userController.create(createUserDto);
      expect(userService.create).toBeCalled();
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userControllerCreateSucessResult);
      expect(result.email).toEqual(userControllerCreateSucessResult.email);
      expect(result.id).toEqual(userControllerCreateSucessResult.id);
    })
  })
});