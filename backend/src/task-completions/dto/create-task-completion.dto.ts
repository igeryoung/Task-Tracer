// src/task-completions/dto/create-task-completion.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTaskCompletionDto {
  @IsUUID()
  @IsNotEmpty()
  task_id: string;
}
