import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
import type { User } from '@prisma/client';

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
}
