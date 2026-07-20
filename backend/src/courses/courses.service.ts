import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import type { Prisma } from '@prisma/client';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, instructorId: number) {
    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        category: createCourseDto.category,
        level: createCourseDto.level,
        price: createCourseDto.price,
        instructorId: instructorId,
      },
    });
  }

  async findAll(query: QueryCourseDto) {
    const { search, category, level, sort, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      status: 'published',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    let orderBy: Prisma.CourseOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
      const [field, order] = sort.split(':');
      const sortOrder = order === 'desc' ? 'desc' : 'asc';
      if (field === 'title') {
        orderBy = { title: sortOrder };
      } else if (field === 'price') {
        orderBy = { price: sortOrder };
      } else if (field === 'createdAt') {
        orderBy = { createdAt: sortOrder };
      } else if (field === 'avgRating') {
        orderBy = { avgRating: sortOrder };
      } else if (field === 'enrollCount') {
        orderBy = { enrollCount: sortOrder };
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          lessons: {
            select: {
              id: true,
              title: true,
              duration: true,
              isFree: true,
              order: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findInstructorCourses(instructorId: number) {
    return this.prisma.course.findMany({
      where: { instructorId },
      orderBy: { createdAt: 'desc' },
      include: {
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
    userId: number,
    userRole: string,
  ) {
    const course = await this.findOne(id);
    if (userRole !== (Role.ADMIN as string) && course.instructorId !== userId) {
      throw new ForbiddenException('You do not own this course');
    }
    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const course = await this.findOne(id);
    if (userRole !== (Role.ADMIN as string) && course.instructorId !== userId) {
      throw new ForbiddenException('You do not own this course');
    }
    return this.prisma.course.delete({
      where: { id },
    });
  }
}
