/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/appointments/appointments.service.ts
import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {
    // Subscribe to real-time Postgres changes
    this.supabase
      .channel('realtime_appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          this.logger.debug(`DB change event: ${payload.eventType}`);
          // TODO: call gateway.broadcastChange(event, payload.new)
        },
      )
      .subscribe();
  }

  async findAll(userId?: string): Promise<Appointment[]> {
    let query = this.supabase.from('appointments').select('*');
    if (userId) {
      query = query.eq('userId', userId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await this.supabase
      .from('appointments')
      .insert([dto])
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    console.log(dto);
    const { data, error } = await this.supabase
      .from('appointments')
      .update(dto)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    if (!data) throw new NotFoundException(`Appointment #${id} not found`);
    return data;
  }

  async remove(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
