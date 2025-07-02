// src/tasks/dto/update-task.dto.ts
// This DTO defines the shape for updating an existing task.
// All fields are optional since a user might only update one thing at a time.

import {
  IsString,
  IsOptional,
  IsIn,
  IsBoolean,
  Matches,
  Length,
  IsNotEmpty,
} from 'class-validator';

const allowedCategories = ['work', 'personal', 'study', 'urgent'];

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsIn(allowedCategories)
  category?: string;

  @IsOptional()
  @IsBoolean()
  is_completed?: boolean;

  @IsOptional()
  @IsString()
  @Length(7, 7)
  @Matches(/^[01]{7}$/)
  repeat_day?: string;
}
