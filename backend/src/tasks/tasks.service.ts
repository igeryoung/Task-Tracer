/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/tasks/tasks.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  // --- Create a new task ---
  async create(createTaskDto: CreateTaskDto, userId: string) {
    const { text, category, task_type, repeat_day } = createTaskDto;

    // const initialPosition = 0;

    const { data, error } = await this.supabase
      .from('tasks')
      .insert({
        text,
        category,
        task_type,
        repeat_day: task_type === 'recurring' ? repeat_day : null,
        user_id: userId,
        // position: initialPosition, // Note: We kept position in the DTO for now, but DB schema removed it. Let's assume it might come back.
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // --- Find all tasks for the logged-in user ---
  async findAll(userId: string) {
    // Here, you would implement the logic to fetch tasks for "today".
    // This involves fetching all 'single' tasks that aren't complete,
    // plus all 'recurring' tasks that match today's weekday.
    // For now, we'll fetch all tasks as a starting point.

    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  // --- Find a single task by its ID ---
  async findOne(id: string, userId: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    return data;
  }

  // --- Update a task ---
  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(updateTaskDto)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException(
        `Task with ID "${id}" not found or update failed.`,
      );
    }
    return data;
  }

  // --- Delete a task ---
  async remove(id: string, userId: string) {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Task with ID "${id}" not found or delete failed.`,
      );
    }
    return { message: `Task with ID "${id}" successfully deleted.` };
  }
}
