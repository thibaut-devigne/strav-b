import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
// import { UpdateActivityDto } from './dto/update-activity.dto';
import { Repository } from 'typeorm';
import { Activity, ActivityType } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DecodedToken } from 'src/auth/auth.guard';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>
  ) {}
  
  async create(createActivityDto: CreateActivityDto, decodedToken: DecodedToken) {
    let userId = decodedToken.userId

    let activityToCreate = {
      ...createActivityDto,
      activityType: ActivityType.RUNNING,
      userId: userId
    }

    //BASIC VERIFICATION
    let activityStartTime = new Date(activityToCreate.startTime).toISOString()
    if(activityStartTime > (new Date()).toISOString()) {
      throw new Error("Invalid Date");
    }

    if(!activityToCreate?.name) {
      throw new Error("Missing Activity Name");
    }

    if(activityToCreate.distance < 0) {
      throw new Error("Invalid Distance");
    }

    if(activityToCreate.duration < 0) {
      throw new Error("Invalid Duration");
    }

    const activity = this.activityRepo.create(activityToCreate)
    return await this.activityRepo.save(activity);
  }

  // findAll() {
  //   return `This action returns all activity`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} activity`;
  // }

  // update(id: number, updateActivityDto: UpdateActivityDto) {
  //   return `This action updates a #${id} activity`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} activity`;
  // }
}
