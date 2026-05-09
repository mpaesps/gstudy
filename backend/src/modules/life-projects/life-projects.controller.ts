import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpsertLifeProjectDto } from './dto/upsert-life-project.dto';
import { LifeProjectsService } from './life-projects.service';

@Controller('students/:studentId/life-project')
@UseGuards(JwtAuthGuard)
export class LifeProjectsController {
  constructor(private readonly service: LifeProjectsService) {}

  @Get()
  findByStudent(@Param('studentId') studentId: string) {
    return this.service.findByStudent(studentId);
  }

  @Put()
  upsert(@Param('studentId') studentId: string, @Body() dto: UpsertLifeProjectDto) {
    return this.service.upsert(studentId, dto);
  }
}
