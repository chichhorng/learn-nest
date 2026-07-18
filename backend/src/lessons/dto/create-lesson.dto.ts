export class CreateLessonDto {
  title!: string;
  content!: string;
  order!: number;
  isFree!: boolean;
  courseId!: number;
}
