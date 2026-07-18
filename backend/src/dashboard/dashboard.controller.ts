import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('instructor-stats')
  @Roles(Role.INSTRUCTOR)
  getInstructorStats(@CurrentUser() user: User) {
    return this.dashboardService.getInstructorStats(user.id);
  }

  @Get('student-stats')
  @Roles(Role.STUDENT)
  getStudentStats(@CurrentUser() user: User) {
    return this.dashboardService.getStudentStats(user.id);
  }
}
