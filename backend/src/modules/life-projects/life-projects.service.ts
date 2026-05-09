import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UpsertLifeProjectDto } from './dto/upsert-life-project.dto';

@Injectable()
export class LifeProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findByStudent(studentId: string) {
    return this.prisma.lifeProject.findUnique({ where: { studentId } });
  }

  upsert(studentId: string, dto: UpsertLifeProjectDto) {
    return this.prisma.lifeProject.upsert({
      where: { studentId },
      update: dto,
      create: { studentId, ...dto },
    });
  }
}
