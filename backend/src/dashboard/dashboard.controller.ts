import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('instructor-stats')
  @Roles(Role.INSTRUCTOR)
  getInstructorStats() {
    return this.dashboardService.getInstructorStats();
  }

  @Get('student-stats')
  @Roles(Role.STUDENT)
  getStudentStats() {
    return this.dashboardService.getStudentStats();
  }
}
