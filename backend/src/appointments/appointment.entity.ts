// src/appointments/appointment.entity.ts
export interface Appointment {
  id: number;
  subject: string;
  description?: string;
  startTime: string;
  endTime: string;
  color?: string;
  classType?: string;
  isAllDay?: boolean;
  recurrenceRule?: string;
  startTimezone?: string;
  endTimezone?: string;
  userId: string;
}
