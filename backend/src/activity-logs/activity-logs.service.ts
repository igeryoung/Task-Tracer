/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/activity-logs/activity-logs.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async create(createDto: CreateActivityLogDto, userId: string) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .insert({ ...createDto, user_id: userId })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false }); // Show newest logs first

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new NotFoundException(`Activity log with ID "${id}" not found.`);
    }
    return data;
  }

  async update(id: string, updateDto: UpdateActivityLogDto, userId: string) {
    const { data, error } = await this.supabase
      .from('activity_logs')
      .update(updateDto)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(
        `Activity log with ID "${id}" not found or update failed.`,
      );
    }
    return data;
  }

  async remove(id: string, userId: string) {
    const { error } = await this.supabase
      .from('activity_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Activity log with ID "${id}" not found or delete failed.`,
      );
    }
    return { message: `Activity log with ID "${id}" successfully deleted.` };
  }
}
