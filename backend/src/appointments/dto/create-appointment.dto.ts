// src/appointments/dto/create-appointment.dto.ts
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
export class CreateAppointmentDto {
  @IsString() subject: string;
  @IsOptional() @IsString() description?: string;
  @IsDateString() startTime: string;
  @IsDateString() endTime: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() classType?: string;
  @IsOptional() @IsBoolean() isAllDay?: boolean;
  @IsOptional() @IsString() recurrenceRule?: string;
  @IsOptional() @IsString() startTimezone?: string;
  @IsOptional() @IsString() endTimezone?: string;
  @IsString() userId: string;
}
