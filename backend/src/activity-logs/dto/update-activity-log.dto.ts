// src/activity-logs/dto/update-activity-log.dto.ts
// Defines and validates the data for updating an existing log entry.

import {
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

const allowedStatuses = ['completed', 'in_progress', 'on_hold', 'cancelled'];

export class UpdateActivityLogDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  time_cost_minutes?: number;

  @IsOptional()
  @IsIn(allowedStatuses)
  status?: string;
}
