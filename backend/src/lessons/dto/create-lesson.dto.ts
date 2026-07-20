import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  content!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsBoolean()
  isFree!: boolean;

  @IsInt()
  courseId!: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}
