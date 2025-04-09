import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../auth/auth.guard';

describe('ActivityController', () => {
  let activityController: ActivityController;
  
  const mockActivityService = {}
  const mockAuthGuard = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService],
    })
    .overrideProvider(ActivityService)
    .useValue(mockActivityService)
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    activityController = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(activityController).toBeDefined();
  });
});
