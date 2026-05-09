import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TutorsService } from './tutors.service';

@Controller('tutors')
@UseGuards(JwtAuthGuard)
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Get()
  findAll() {
    return this.tutorsService.findAll();
  }
}
