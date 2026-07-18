export class Enrollment {
  id!: number;
  userId!: number;
  courseId!: number;
  progress!: number;
  completedLessons!: string; // JSON string representing completed lesson IDs
  enrolledAt!: Date;
  completedAt?: Date;
}
