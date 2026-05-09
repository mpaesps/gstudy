import { TutoringType } from '@prisma/client';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTutoringSessionDto {
  @IsString()
  tutorId!: string;

  @IsEnum(TutoringType)
  type!: TutoringType;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  periodicity?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studentIds!: string[];
}
