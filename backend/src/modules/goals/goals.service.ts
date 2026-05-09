import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        studentId: dto.studentId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        createdById: dto.createdById,
      },
    });
  }

  findByStudent(studentId: string) {
    return this.prisma.goal.findMany({
      where: { studentId },
      include: { actionPlans: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, dto: UpdateGoalDto) {
    return this.prisma.goal.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }
}
