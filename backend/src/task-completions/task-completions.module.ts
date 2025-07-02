// src/task-completions/task-completions.module.ts
import { Module } from '@nestjs/common';
import { TaskCompletionsService } from './task-completions.service';
import { TaskCompletionsController } from './task-completions.controller';

@Module({
  controllers: [TaskCompletionsController],
  providers: [TaskCompletionsService],
})
export class TaskCompletionsModule {}
