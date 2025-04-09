import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UserSubscriber } from '../src/users/subscribers/hashPassword.subscriber';
import { AuthGuard } from '../src/auth/auth.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUserRepository = {
    find: jest.fn()
  }
  const mockUsersSubscriber = {}
  const mockAuthGuard = {}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
    .overrideProvider(getRepositoryToken(User))
    .useValue(mockUserRepository)
    .overrideProvider(UserSubscriber)
    .useValue(mockUsersSubscriber)
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const usersInDB = [{ id: 1, firstname: "John"}]
    mockUserRepository.find.mockResolvedValueOnce(usersInDB)
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(usersInDB);
  }); 
});
