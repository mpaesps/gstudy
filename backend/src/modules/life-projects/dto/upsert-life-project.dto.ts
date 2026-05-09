import { IsOptional, IsString } from 'class-validator';

export class UpsertLifeProjectDto {
  @IsOptional()
  @IsString()
  interests?: string;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  dreams?: string;

  @IsOptional()
  @IsString()
  nextSteps?: string;
}
