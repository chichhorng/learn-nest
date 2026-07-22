import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: Role;
  avatar?: string;
  bio?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const isApproved = data.role === Role.INSTRUCTOR ? false : true;
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role || 'student',
        avatar: data.avatar,
        bio: data.bio,
        isApproved,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Email is already in use by another account',
        );
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findPendingInstructors(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: Role.INSTRUCTOR,
        isApproved: false,
      },
    });
  }

  async approveInstructor(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async remove(id: number): Promise<User> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId: id },
    });
    for (const course of courses) {
      await this.prisma.course.delete({
        where: { id: course.id },
      });
    }

    // Get all enrollments of the user before deleting them to update course counts
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: id },
    });
    const courseIdsWithChangedEnrollments = Array.from(
      new Set(enrollments.map((e) => e.courseId)),
    );

    // Get all reviews of the user before deleting them to update course ratings
    const reviews = await this.prisma.review.findMany({
      where: { userId: id },
    });
    const courseIdsWithChangedReviews = Array.from(
      new Set(reviews.map((r) => r.courseId)),
    );

    await this.prisma.enrollment.deleteMany({
      where: { userId: id },
    });

    await this.prisma.review.deleteMany({
      where: { userId: id },
    });

    // Update enrollCount for affected courses
    for (const courseId of courseIdsWithChangedEnrollments) {
      const activeEnrollCount = await this.prisma.enrollment.count({
        where: { courseId },
      });
      await this.prisma.course.update({
        where: { id: courseId },
        data: { enrollCount: activeEnrollCount },
      });
    }

    // Update avgRating for affected courses
    for (const courseId of courseIdsWithChangedReviews) {
      const aggregate = await this.prisma.review.aggregate({
        where: { courseId },
        _avg: { rating: true },
      });
      await this.prisma.course.update({
        where: { id: courseId },
        data: { avgRating: aggregate._avg.rating || 0 },
      });
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(
    id: number,
    currentPass: string,
    newPass: string,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
