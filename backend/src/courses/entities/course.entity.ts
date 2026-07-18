import { CourseLevel } from '../../common/enums/course-level.enum';
import { CourseStatus } from '../../common/enums/course-status.enum';

export class Course {
  id!: number;
  title!: string;
  description!: string;
  thumbnail!: string;
  category!: string;
  level!: CourseLevel;
  status!: CourseStatus;
  price!: number;
  instructorId!: number;
  avgRating!: number;
  enrollCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
