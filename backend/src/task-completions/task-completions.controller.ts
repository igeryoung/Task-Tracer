/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/task-completions/task-completions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskCompletionsService } from './task-completions.service';
import { CreateTaskCompletionDto } from './dto/create-task-completion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('task-completions')
@UseGuards(JwtAuthGuard)
export class TaskCompletionsController {
  constructor(
    private readonly taskCompletionsService: TaskCompletionsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateTaskCompletionDto, @Req() req) {
    const userId = req.user.sub;
    return this.taskCompletionsService.create(createDto, userId);
  }

  // Example: GET /task-completions?date=2025-07-02
  @Get()
  findByDate(@Query('date') date: string, @Req() req) {
    const userId = req.user.sub;
    const searchDate = date || new Date().toISOString().split('T')[0];
    return this.taskCompletionsService.findByDate(searchDate, userId);
  }
}
