import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn()
  }
  const mockAuthGuard = {}

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      exports: [AuthService],
    })
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    authController = authModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should let user sign-in/login', () => {
    let signinDto = {
      email: "",
      password: ""
    }
    mockAuthService.signIn.mockImplementationOnce(() => {
      return { access_token: "12fd6g541e516gf8d" }
    })
    expect(authController.signIn(signinDto)).toEqual({ access_token: "12fd6g541e516gf8d" });
  });
});
