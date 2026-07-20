import { IsEnum, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { CourseLevel } from '../../common/enums/course-level.enum';

export class CreateCourseDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsString()
  @MinLength(1)
  category!: string;

  @IsEnum(CourseLevel)
  level!: CourseLevel;

  @IsNumber()
  @Min(0)
  price!: number;
}
