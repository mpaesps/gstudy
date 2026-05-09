import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('student/:id')
  student(@Param('id') id: string) {
    return this.dashboardsService.student(id);
  }

  @Get('tutor')
  tutor(@Query('tutorId') tutorId?: string) {
    return this.dashboardsService.tutor(tutorId);
  }

  @Get('coordinator')
  coordinator() {
    return this.dashboardsService.coordinator();
  }
}
