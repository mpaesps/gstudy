import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompleteTutoringSessionDto } from './dto/complete-tutoring-session.dto';
import { CreateTutoringSessionDto } from './dto/create-tutoring-session.dto';
import { TutoringSessionsService } from './tutoring-sessions.service';

@Controller('tutoring-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TutoringSessionsController {
  constructor(private readonly service: TutoringSessionsService) {}

  @Post()
  @Roles(Role.TUTOR, Role.COORDINATOR, Role.ADMIN)
  create(@Body() dto: CreateTutoringSessionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.service.findAll(request.user as AuthenticatedUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.service.findOne(id, request.user as AuthenticatedUser);
  }

  @Post(':id/complete')
  @Roles(Role.TUTOR, Role.COORDINATOR, Role.ADMIN)
  complete(@Param('id') id: string, @Body() dto: CompleteTutoringSessionDto) {
    return this.service.complete(id, dto);
  }
}
