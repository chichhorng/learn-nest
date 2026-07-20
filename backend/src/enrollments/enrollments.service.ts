import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(userId: number, courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (course.status !== 'published') {
      throw new BadRequestException(
        'Cannot enroll in a course that is not published',
      );
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.course.update({
        where: { id: courseId },
        data: {
          enrollCount: {
            increment: 1,
          },
        },
      });

      return tx.enrollment.create({
        data: {
          userId,
          courseId,
          progress: 0,
          completedLessons: [],
        },
      });
    });
  }

  async findByUser(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async updateProgress(userId: number, updateProgressDto: UpdateProgressDto) {
    const { lessonId, completed } = updateProgressDto;

    return this.prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.findUnique({
        where: { id: lessonId },
      });
      if (!lesson) {
        throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
      }

      const enrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId: lesson.courseId },
        },
      });
      if (!enrollment) {
        throw new BadRequestException('You are not enrolled in this course');
      }

      let completedList: number[] = [];
      if (
        enrollment.completedLessons &&
        typeof enrollment.completedLessons === 'string'
      ) {
        try {
          completedList = JSON.parse(enrollment.completedLessons) as number[];
        } catch {
          completedList = [];
        }
      } else if (Array.isArray(enrollment.completedLessons)) {
        completedList = enrollment.completedLessons as number[];
      }

      if (completed) {
        if (!completedList.includes(lessonId)) {
          completedList.push(lessonId);
        }
      } else {
        completedList = completedList.filter((id) => id !== lessonId);
      }

      const totalLessons = await tx.lesson.count({
        where: { courseId: lesson.courseId },
      });

      const progress =
        totalLessons > 0
          ? Math.round((completedList.length / totalLessons) * 100)
          : 0;
      const completedAt = progress === 100 ? new Date() : null;

      return tx.enrollment.update({
        where: { id: enrollment.id },
        data: {
          completedLessons: completedList,
          progress,
          completedAt,
        },
      });
    });
  }
}
