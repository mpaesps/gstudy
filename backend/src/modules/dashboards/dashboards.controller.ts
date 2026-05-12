import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('student/:id')
  @Roles(Role.STUDENT, Role.ADMIN)
  student(@Param('id') id: string, @Request() request: { user: AuthenticatedUser }) {
    return this.dashboardsService.student(id, request.user);
  }

  @Get('tutor')
  @Roles(Role.TUTOR, Role.COORDINATOR, Role.ADMIN)
  tutor(@Query('tutorId') tutorId: string | undefined, @Request() request: { user: AuthenticatedUser }) {
    return this.dashboardsService.tutor(tutorId, request.user);
  }

  @Get('coordinator')
  @Roles(Role.COORDINATOR, Role.ADMIN)
  coordinator() {
    return this.dashboardsService.coordinator();
  }
}
