import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findOne: jest.fn().mockImplementation(dto => dto),
  }

  const mockAccessToken = "aze321546azer"
  const mockJWTService = {
    signAsync: jest.fn().mockImplementation(payload => Promise.resolve(mockAccessToken)),
  } 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: mockJWTService
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should not let user signIn if user not found', async () => {
    mockUsersService.findOne.mockImplementationOnce(() => null)
    await expect(authService.signIn("", "")).rejects.toThrow("Unauthorized");
  });

  it('should not let user signIn if user has no password (in DB)', async () => {
    mockUsersService.findOne.mockImplementationOnce(() => ({ firstName: "John" }))
    await expect(authService.signIn("", "")).rejects.toThrow("Unauthorized");
  });

  it('should not let user signIn if password is invalid', async () => {
    const email = "john.doe@gmail.com";
    const pass = "superPassword";

    mockUsersService.findOne.mockImplementationOnce(() => {
      return { firstName: "John", password: "hashedPassWordHere" };
    })

    const bcryptCompare = jest.fn().mockReturnValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    await expect(authService.signIn(email, pass)).rejects.toThrow("Unauthorized");
  });

  it('should let user signIn if password is valid', async () => {
    const email = "john.doe@gmail.com";
    const pass = "superPassword";

    mockUsersService.findOne.mockImplementationOnce(() => {
      return { firstName: "John", password: "hashedPassWordHere" };
    })

    const bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const expectedResult = { access_token: mockAccessToken }
    const result = await authService.signIn(email, pass)
    expect(result).toEqual(expectedResult)
  });
});
