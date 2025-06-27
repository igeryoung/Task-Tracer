// src/appointments/dto/create-appointment.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString() subject: string;
  @IsDateString() startTime: string;
  @IsDateString() endTime: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() classType?: string;
}
