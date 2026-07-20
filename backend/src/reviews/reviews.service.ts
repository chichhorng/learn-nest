import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../lib/database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const { courseId } = createReviewDto;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
    if (!enrollment) {
      throw new ForbiddenException(
        'You must be enrolled in this course to leave a review',
      );
    }

    // Check duplicate review
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        courseId,
      },
    });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this course');
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          rating: createReviewDto.rating,
          comment: createReviewDto.comment,
          userId,
          courseId,
        },
      });

      // Calculate new average rating for the course
      const aggregate = await tx.review.aggregate({
        where: { courseId },
        _avg: {
          rating: true,
        },
      });

      await tx.course.update({
        where: { id: courseId },
        data: {
          avgRating: aggregate._avg.rating || 0,
        },
      });

      return review;
    });
  }
}
