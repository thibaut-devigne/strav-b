import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSubscriber } from './subscribers/hashPassword.subscriber';
import { AuthGuard } from '../auth/auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

const defaultDBUser: User = {
  id: Date.now(),
  username: "HarryPot",
  firstname: "Harry",
  lastname: "Potter",
  email: "harry.potter@poudlard.com",
  password: "Griffondor123",
  runningSessions: []
}

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    create: jest.fn(dto => {
      return { ...dto, id: Date.now()}
    })
  }
  const mockUsersSubscriber = {}
  const mockAuthGuard = {}

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UserSubscriber],
      exports: [UsersService],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .overrideProvider(UserSubscriber)
    .useValue(mockUsersSubscriber)
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    usersController = userModule.get<UsersController>(UsersController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(usersController).toBeDefined();
    });
    it('should create new user', () => {
      let newUser = {
        username: "TomJedusor",
        firstname: "Harry",
        lastname: "Potter",
        email: "harry.potter@poudlard.com",
        password: "Griffondor123",
      }
      let expectedResult = {
        ...newUser,
        id: expect.any(Number),
        password: expect.any(String),
      }
      expect(usersController.create(newUser)).toEqual(expectedResult);
      expect(mockUsersService.create).toHaveBeenCalled()
    });

    it('should find all users', () => {
      let databaseUser = [
        { ...defaultDBUser, id: 1, email: "harry.potter@poudlard.com" }, 
        { ...defaultDBUser, id: 2, email: "harry.potter2@poudlard.com" }
      ]
      mockUsersService.findAll.mockImplementationOnce(() => {
        return databaseUser
      })
      expect(usersController.findAll()).toEqual(databaseUser);
      expect(mockUsersService.findAll).toHaveBeenCalled()
    });
  });
});
