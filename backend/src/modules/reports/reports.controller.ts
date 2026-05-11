import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COORDINATOR, Role.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('tutoring')
  tutoring() {
    return this.reportsService.tutoring();
  }

  @Get('attendance')
  attendance() {
    return this.reportsService.attendance();
  }

  @Get('students-without-followup')
  studentsWithoutFollowup() {
    return this.reportsService.studentsWithoutFollowup();
  }
}
