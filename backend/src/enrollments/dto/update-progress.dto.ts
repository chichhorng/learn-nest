import { IsBoolean, IsInt } from 'class-validator';

export class UpdateProgressDto {
  @IsInt()
  lessonId!: number;

  @IsBoolean()
  completed!: boolean;
}
