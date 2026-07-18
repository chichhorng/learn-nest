import { CourseLevel } from '../../common/enums/course-level.enum';

export class QueryCourseDto {
  search?: string;
  category?: string;
  level?: CourseLevel;
  sort?: string;
  page?: number;
  limit?: number;
}
