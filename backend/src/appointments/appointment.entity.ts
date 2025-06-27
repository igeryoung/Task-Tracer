// src/appointments/appointment.entity.ts (for TS typing)
export interface Appointment {
  id: number;
  subject: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  color?: string;
  classType?: string;
}
