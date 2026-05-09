import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post('goals')
  create(@Body() dto: CreateGoalDto) {
    return this.goalsService.create(dto);
  }

  @Get('students/:id/goals')
  findByStudent(@Param('id') id: string) {
    return this.goalsService.findByStudent(id);
  }

  @Patch('goals/:id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(id, dto);
  }
}
