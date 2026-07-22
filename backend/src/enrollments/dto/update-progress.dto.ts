import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateProgressDto {
  @IsInt()
  lessonId!: number;

  @IsBoolean()
  completed!: boolean;

  @IsInt()
  @IsOptional()
  courseId?: number;
}
