/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/activity-logs/activity-logs.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activity-logs') // Route prefix: /activity-logs
@UseGuards(JwtAuthGuard) // Protect all routes
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  create(@Body() createDto: CreateActivityLogDto, @Req() req) {
    const userId = req.user.sub;
    return this.activityLogsService.create(createDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.sub;
    return this.activityLogsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;
    return this.activityLogsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateActivityLogDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.activityLogsService.update(id, updateDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub;
    return this.activityLogsService.remove(id, userId);
  }
}
