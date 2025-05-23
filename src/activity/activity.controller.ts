import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createActivityDto: CreateActivityDto
  ) {
    let user = req?.user
    return this.activityService.create(createActivityDto, user);
  }

  // @Get()
  // findAll() {
  //   return this.activityService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.activityService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
  //   return this.activityService.update(+id, updateActivityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.activityService.remove(+id);
  // }
}
