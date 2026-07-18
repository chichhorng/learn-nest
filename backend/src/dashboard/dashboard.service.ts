import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getInstructorStats(instructorId: number) {
    // Total courses taught by the instructor
    const coursesCount = await this.prisma.course.count({
      where: { instructorId },
    });

    // Total students enrolled in all of the instructor's courses
    const enrollmentsCount = await this.prisma.enrollment.count({
      where: {
        course: {
          instructorId,
        },
      },
    });

    // Average rating of all the instructor's courses
    const aggregate = await this.prisma.course.aggregate({
      where: { instructorId },
      _avg: {
        avgRating: true,
      },
    });

    return {
      coursesCount,
      totalStudents: enrollmentsCount,
      averageRating: aggregate._avg.avgRating || 0,
    };
  }

  async getStudentStats(studentId: number) {
    // Number of enrolled courses
    const enrolledCoursesCount = await this.prisma.enrollment.count({
      where: { userId: studentId },
    });

    // Number of completed courses (progress is 100)
    const completedCoursesCount = await this.prisma.enrollment.count({
      where: {
        userId: studentId,
        progress: 100,
      },
    });

    // Total study hours metric based on completed lessons
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: studentId },
      select: {
        completedLessons: true,
      },
    });

    let totalCompletedLessons = 0;
    for (const enrollment of enrollments) {
      if (Array.isArray(enrollment.completedLessons)) {
        totalCompletedLessons += enrollment.completedLessons.length;
      } else if (enrollment.completedLessons && typeof enrollment.completedLessons === 'string') {
        try {
          const completedList = JSON.parse(enrollment.completedLessons);
          if (Array.isArray(completedList)) {
            totalCompletedLessons += completedList.length;
          }
        } catch {
          // ignore
        }
      }
    }

    const studyHours = totalCompletedLessons * 0.5; // assumption: 30 minutes per lesson

    return {
      enrolledCoursesCount,
      completedCoursesCount,
      studyHours,
    };
  }
}
