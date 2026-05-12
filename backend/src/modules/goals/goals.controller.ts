import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post('goals')
  @Roles(Role.TUTOR)
  create(@Body() dto: CreateGoalDto, @Request() request: { user: AuthenticatedUser }) {
    return this.goalsService.create(dto, request.user);
  }

  @Get('students/:id/goals')
  findByStudent(@Param('id') id: string) {
    return this.goalsService.findByStudent(id);
  }

  @Patch('goals/:id')
  @Roles(Role.TUTOR, Role.COORDINATOR, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto);
  }
}
