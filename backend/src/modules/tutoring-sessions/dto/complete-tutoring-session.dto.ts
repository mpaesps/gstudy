import { IsArray, IsBoolean, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttendanceInput {
  @IsString()
  studentId!: string;

  @IsBoolean()
  present!: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CompleteTutoringSessionDto {
  @IsString()
  @MinLength(10)
  observations!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceInput)
  attendance!: AttendanceInput[];
}
