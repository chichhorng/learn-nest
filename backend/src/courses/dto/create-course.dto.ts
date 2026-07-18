import { CourseLevel } from '../../common/enums/course-level.enum';

export class CreateCourseDto {
  title!: string;
  description!: string;
  category!: string;
  level!: CourseLevel;
  price!: number;
}
