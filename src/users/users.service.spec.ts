import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => Promise.resolve({ id: Date.now(), ...user})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, 
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user record and return it', async () => {
    let userDto = {
      username: "antoine_dupont",
      firstname: "Antoine",
      lastname: "Dupont",
      email: "antoine.dupont@gmail.com",
      password: "azerty123",
    }
    expect(await service.create(userDto)).toEqual({
      id: expect.any(Number),
      ...userDto
    });
  });
});
