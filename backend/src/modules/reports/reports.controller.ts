import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
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
