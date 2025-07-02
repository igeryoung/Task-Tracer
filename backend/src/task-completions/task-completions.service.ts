/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/task-completions/task-completions.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateTaskCompletionDto } from './dto/create-task-completion.dto';

@Injectable()
export class TaskCompletionsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  // Creates a new completion record for today
  async create(createDto: CreateTaskCompletionDto, userId: string) {
    const { task_id } = createDto;
    const completion_date = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD

    const { data, error } = await this.supabase
      .from('task_completions')
      .insert({
        task_id,
        user_id: userId,
        completion_date,
      })
      .select()
      .single();

    if (error) {
      // Handle potential unique constraint violation (already completed today)
      if (error.code === '23505') {
        return { message: 'Task already completed today.' };
      }
      throw new Error(error.message);
    }
    return data;
  }

  // Finds all completions for a specific date
  async findByDate(date: string, userId: string) {
    const { data, error } = await this.supabase
      .from('task_completions')
      .select('task_id') // We only need the IDs to check for completion
      .eq('user_id', userId)
      .eq('completion_date', date);

    if (error) {
      throw new Error(error.message);
    }
    // Return an array of task IDs that have been completed on this date
    return data.map((item) => item.task_id);
  }
}
