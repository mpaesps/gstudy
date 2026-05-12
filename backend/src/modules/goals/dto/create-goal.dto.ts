import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  studentId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

}
