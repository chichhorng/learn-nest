import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkCourseOwnership(
    courseId: number,
    userId: number,
    userRole: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    if (userRole !== (Role.ADMIN as string) && course.instructorId !== userId) {
      throw new ForbiddenException('You do not own this course');
    }
  }

  async create(
    createLessonDto: CreateLessonDto,
    userId: number,
    userRole: string,
  ) {
    await this.checkCourseOwnership(createLessonDto.courseId, userId, userRole);
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        order: createLessonDto.order,
        isFree: createLessonDto.isFree,
        courseId: createLessonDto.courseId,
        videoUrl: createLessonDto.videoUrl,
        duration: createLessonDto.duration ?? 0,
      },
    });
  }

  async findOne(id: number, userId?: number, userRole?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    if (!lesson.isFree) {
      if (!userId) {
        throw new ForbiddenException(
          'You must be enrolled to view this lesson',
        );
      }
      const isAdmin = userRole === (Role.ADMIN as string);
      const isInstructor = lesson.course.instructorId === userId;

      if (!isAdmin && !isInstructor) {
        const enrollment = await this.prisma.enrollment.findUnique({
          where: {
            userId_courseId: { userId, courseId: lesson.courseId },
          },
        });
        if (!enrollment) {
          throw new ForbiddenException(
            'You must be enrolled to view this lesson',
          );
        }
      }
    }

    const lessonData = { ...lesson };
    delete (lessonData as Partial<typeof lesson>).course;
    return lessonData;
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    userId: number,
    userRole: string,
  ) {
    const lesson = await this.findOne(id, userId, userRole);
    await this.checkCourseOwnership(lesson.courseId, userId, userRole);
    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const lesson = await this.findOne(id, userId, userRole);
    await this.checkCourseOwnership(lesson.courseId, userId, userRole);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
