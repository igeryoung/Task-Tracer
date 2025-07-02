import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';

// Define the allowed categories and task types
const allowedCategories = ['work', 'personal', 'study', 'urgent'];
const allowedTaskTypes = ['single', 'recurring'];

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsIn(allowedCategories)
  category: string;

  @IsIn(allowedTaskTypes)
  task_type: 'single' | 'recurring';

  @IsOptional()
  @IsString()
  @Length(7, 7, { message: 'repeat_day must be exactly 7 characters long' })
  @Matches(/^[01]{7}$/, {
    message: 'repeat_day must be a string of 7 zeros or ones',
  })
  repeat_day?: string;
}
