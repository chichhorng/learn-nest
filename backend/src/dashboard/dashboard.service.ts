import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getInstructorStats() {
    return { coursesCount: 0, totalStudents: 0, averageRating: 0 };
  }

  getStudentStats() {
    return { enrolledCoursesCount: 0, completedCoursesCount: 0, studyHours: 0 };
  }
}
