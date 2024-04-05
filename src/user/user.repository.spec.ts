import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepo } from './user.repository';

const userEntityFindSucessResult = [
    new User({
        id: 1,
        email: "test1@email.com.br",
    }),
    new User({
        id: 2,
        email: "test2@email.com.br",
    }),
    new User(
        {
            id: 3,
            email: "test3@email.com.br",
        }
    )
];
const userEntityFindOneSucessResult = new User({
    id: 1,
    email: "test1@email.com.br",
});
const userEntitySaveSucessResult = new User(
    {
        id: 1,
        email: "test1@email.com.br",
    }
);
const createUserDto = {
    name: "Test1",
    lastName: "Test1",
    email: "test1@email.com.br",
    password: "sosecure"
}

describe('UserRepository', () => {
    let userRepo: UserRepo;
    let genericRepo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepo,
                {
                    provide: getRepositoryToken(User),
                    useValue:
                    {
                        find: jest.fn().mockResolvedValue(userEntityFindSucessResult),
                        findOne: jest.fn().mockResolvedValue(userEntityFindOneSucessResult),
                        save: jest.fn().mockResolvedValue(userEntitySaveSucessResult),
                    },
                },
            ],
        }).compile();

        userRepo = module.get<UserRepo>(UserRepo);
        genericRepo = module.get(getRepositoryToken(User));
    });

    describe('UserRepository', () => {
        it('should be defined', async () => {
            expect(userRepo).toBeDefined();
        });
    })

    describe('Generic Repo', () => {
        it('should be defined', async () => {
            expect(genericRepo).toBeDefined();
        });
    })

    describe('Testing findAll from UserRepository', () => {
        it('should return a list of users', async () => {
            const result = await userRepo.findAll();
            expect(genericRepo.find).toBeCalled();
            expect(genericRepo.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userEntityFindSucessResult);
        })
    });

    describe('Testing findOne from UserRepository', () => {
        it('should return a single user', async () => {
            const id = 1;
            const result = await userRepo.findOne(id);
            expect(genericRepo.findOne).toBeCalled();
            expect(genericRepo.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userEntityFindOneSucessResult);
        })
    })

    describe('Testing create function from UserRepo', () => {
        it('should create a new user', async () => {
            const result = await userRepo.create(createUserDto);
            expect(genericRepo.save).toBeCalled();
            expect(genericRepo.save).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userEntitySaveSucessResult);
            expect(result.email).toEqual(userEntitySaveSucessResult.email);
            expect(result.id).toEqual(userEntitySaveSucessResult.id);
        })
    })
});
