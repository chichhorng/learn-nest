import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('enroll')
  enroll(@CurrentUser() user: User, @Body() enrollCourseDto: EnrollCourseDto) {
    if (user.role === 'admin') {
      throw new BadRequestException('Admins cannot enroll in courses');
    }
    return this.enrollmentsService.enroll(user.id, enrollCourseDto.courseId);
  }

  @Get('my-courses')
  myCourses(@CurrentUser() user: User) {
    return this.enrollmentsService.findByUser(user.id);
  }

  @Put('progress')
  updateProgress(
    @CurrentUser() user: User,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.enrollmentsService.updateProgress(user.id, updateProgressDto);
  }
}
