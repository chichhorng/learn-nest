import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkCourseOwnership(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    if (course.instructorId !== instructorId) {
      throw new ForbiddenException('You do not own this course');
    }
  }

  async create(createLessonDto: CreateLessonDto, instructorId: number) {
    await this.checkCourseOwnership(createLessonDto.courseId, instructorId);
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        order: Number(createLessonDto.order),
        isFree: Boolean(createLessonDto.isFree),
        courseId: createLessonDto.courseId,
      },
    });
  }

  async findOne(id: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
    instructorId: number,
  ) {
    const lesson = await this.findOne(id);
    await this.checkCourseOwnership(lesson.courseId, instructorId);
    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...updateLessonDto,
        order:
          updateLessonDto.order !== undefined
            ? Number(updateLessonDto.order)
            : undefined,
        isFree:
          updateLessonDto.isFree !== undefined
            ? Boolean(updateLessonDto.isFree)
            : undefined,
      },
    });
  }

  async remove(id: number, instructorId: number) {
    const lesson = await this.findOne(id);
    await this.checkCourseOwnership(lesson.courseId, instructorId);
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
