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

    const completedLessonIds: number[] = [];
    for (const enrollment of enrollments) {
      let list: number[] = [];
      if (Array.isArray(enrollment.completedLessons)) {
        list = enrollment.completedLessons as number[];
      } else if (
        enrollment.completedLessons &&
        typeof enrollment.completedLessons === 'string'
      ) {
        try {
          const parsed = JSON.parse(enrollment.completedLessons) as unknown;
          if (Array.isArray(parsed)) {
            list = parsed as number[];
          }
        } catch {
          // ignore
        }
      }
      for (const id of list) {
        completedLessonIds.push(Number(id));
      }
    }

    let studyHours = 0;
    if (completedLessonIds.length > 0) {
      const lessons = await this.prisma.lesson.findMany({
        where: {
          id: {
            in: completedLessonIds,
          },
        },
        select: {
          duration: true,
        },
      });
      const totalMinutes = lessons.reduce((sum, l) => sum + l.duration, 0);
      studyHours = Number((totalMinutes / 60).toFixed(2));
    }

    return {
      enrolledCoursesCount,
      completedCoursesCount,
      studyHours,
    };
  }
}
