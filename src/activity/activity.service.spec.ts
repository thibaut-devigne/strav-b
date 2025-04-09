import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity, ActivityType, SessionType } from './entities/activity.entity';
import { DecodedToken } from 'src/auth/auth.guard';

describe('ActivityService', () => {
  let service: ActivityService;

  const userId = 123
  const decodedToken: DecodedToken = {
    userId: userId,
    email: "john.doe@gmail.com",
    iat: 123456789,
    exp: 123456789,
  }

  const mockRunningRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(activity => Promise.resolve({ id: Date.now(), ...activity})),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockRunningRepository
        }
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new activity record and return it', async () => {
    let newActivity = {
      type: SessionType.TRAINING,
      startTime: new Date("2025-04-01T15:16:17.123Z"),
      duration: 2400,
      distance: 5000,
      name: "sortie reprise"
    }

    expect(await service.create(newActivity, decodedToken)).toEqual({
      id: expect.any(Number),
      activityType: ActivityType.RUNNING,
      userId: userId,
      ...newActivity
    });
  });

  it('should not create new activity if date is in futur', async () => {
    let startTime = new Date()
    startTime.setDate(startTime.getDate() + 7) //add one week on current date

    let newActivity = {
      type: SessionType.TRAINING,
      startTime: startTime,
      duration: 2400,
      distance: 5000,
      name: "sortie reprise"
    }

    await expect(service.create(newActivity, decodedToken)).rejects.toThrow("Invalid Date");
  });

  it('should not create activity with empty name', async () => {
    let newActivity = {
      type: SessionType.TRAINING,
      startTime: new Date("2025-04-01T15:16:17.123Z"),
      duration: 2400,
      distance: 5000,
      name: ""
    }

    await expect(service.create(newActivity, decodedToken)).rejects.toThrow("Missing Activity Name");
  });

  it('should not create activity with negative distance', async () => {
    let newActivity = {
      type: SessionType.TRAINING,
      startTime: new Date("2025-04-01T15:16:17.123Z"),
      duration: 2400,
      distance: -1500,
      name: "sortie reprise"
    }

    await expect(service.create(newActivity, decodedToken)).rejects.toThrow("Invalid Distance");
  });

  it('should not create activity with negative duration', async () => {
    let newActivity = {
      type: SessionType.TRAINING,
      startTime: new Date("2025-04-01T15:16:17.123Z"),
      duration: -3600,
      distance: 5000,
      name: "sortie reprise"
    }

    await expect(service.create(newActivity, decodedToken)).rejects.toThrow("Invalid Duration");
  });
});
