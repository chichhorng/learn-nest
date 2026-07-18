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
      where: { id: Number(courseId) },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: Number(courseId) },
      },
    });
    if (existing) {
      return existing;
    }

    // Increment course enroll count
    await this.prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        enrollCount: {
          increment: 1,
        },
      },
    });

    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId: Number(courseId),
        progress: 0,
        completedLessons: [],
      },
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

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
    }

    const enrollment = await this.prisma.enrollment.findUnique({
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
      if (!completedList.includes(Number(lessonId))) {
        completedList.push(Number(lessonId));
      }
    } else {
      completedList = completedList.filter((id) => id !== Number(lessonId));
    }

    const totalLessons = await this.prisma.lesson.count({
      where: { courseId: lesson.courseId },
    });

    const progress =
      totalLessons > 0
        ? Math.round((completedList.length / totalLessons) * 100)
        : 0;
    const completedAt = progress === 100 ? new Date() : null;

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        completedLessons: completedList,
        progress,
        completedAt,
      },
    });
  }
}
