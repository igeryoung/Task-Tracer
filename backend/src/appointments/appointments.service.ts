// src/appointments/appointments.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findAll(): Promise<Appointment[]> {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*');
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await this.supabase
      .from('appointments')
      .insert([{ ...dto }])
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const { data, error } = await this.supabase
      .from('appointments')
      .update({ ...dto })
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new NotFoundException(`Appointment #${id} not found`);
    return data;
  }

  async remove(id: number): Promise<void> {
    const { error, count } = await this.supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) throw error;
    // Supabase returns count if configured; otherwise assume deletion
  }
}