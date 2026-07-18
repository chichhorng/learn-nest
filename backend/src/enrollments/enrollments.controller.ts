import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('enroll')
  enroll(@CurrentUser() user: any, @Body('courseId') courseId: number) {
    return this.enrollmentsService.enroll(user.id, courseId);
  }

  @Get('my-courses')
  myCourses(@CurrentUser() user: any) {
    return this.enrollmentsService.findByUser(user.id);
  }

  @Put('progress')
  updateProgress(@CurrentUser() user: any, @Body() updateProgressDto: UpdateProgressDto) {
    return this.enrollmentsService.updateProgress(user.id, updateProgressDto);
  }
}
