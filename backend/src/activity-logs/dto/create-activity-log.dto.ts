// src/activity-logs/dto/create-activity-log.dto.ts
// Defines and validates the data for creating a new log entry.

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';

// Define the allowed statuses based on your logConstants.js
const allowedStatuses = ['completed', 'in_progress', 'on_hold', 'cancelled'];

export class CreateActivityLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  time_cost_minutes?: number;

  @IsIn(allowedStatuses)
  status: string;
}
