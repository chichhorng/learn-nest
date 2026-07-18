import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const courseId = Number(createReviewDto.courseId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const review = await this.prisma.review.create({
      data: {
        rating: Number(createReviewDto.rating),
        comment: createReviewDto.comment,
        userId,
        courseId,
      },
    });

    // Calculate new average rating for the course
    const aggregate = await this.prisma.review.aggregate({
      where: { courseId },
      _avg: {
        rating: true,
      },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        avgRating: aggregate._avg.rating || 0,
      },
    });

    return review;
  }
}
