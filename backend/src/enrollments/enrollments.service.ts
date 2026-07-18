import { Injectable } from '@nestjs/common';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class EnrollmentsService {
  private enrollments: any[] = [];

  enroll(userId: number, courseId: number) {
    const newEnrollment = {
      id: this.enrollments.length + 1,
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date(),
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  findByUser(userId: number) {
    return this.enrollments.filter(e => e.userId === userId);
  }

  updateProgress(userId: number, updateProgressDto: UpdateProgressDto) {
    const enrollment = this.enrollments.find(e => e.userId === userId); // simplified mock
    if (enrollment) {
      // update progress logic mock
      enrollment.progress = 50;
      return enrollment;
    }
    return null;
  }
}
