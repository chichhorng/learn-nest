import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private reviews: any[] = [];

  create(userId: number, createReviewDto: CreateReviewDto) {
    const newReview = { id: this.reviews.length + 1, userId, ...createReviewDto, createdAt: new Date() };
    this.reviews.push(newReview);
    return newReview;
  }
}
