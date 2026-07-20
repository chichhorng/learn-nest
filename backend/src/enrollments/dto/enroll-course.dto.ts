import { IsInt, Min } from 'class-validator';

export class EnrollCourseDto {
  @IsInt()
  @Min(1)
  courseId!: number;
}
