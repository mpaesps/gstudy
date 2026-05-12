import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGoalDto, user: AuthenticatedUser) {
    if (user.role === Role.TUTOR) {
      const tutor = await this.prisma.tutor.findUnique({ where: { userId: user.id } });
      const studentInTutoring = tutor
        ? await this.prisma.sessionParticipant.count({
            where: { studentId: dto.studentId, session: { tutorId: tutor.id } },
          })
        : 0;

      if (!studentInTutoring) {
        throw new ForbiddenException('Tutor pode criar metas apenas para alunos acompanhados');
      }
    }

    return this.prisma.goal.create({
      data: {
        studentId: dto.studentId,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        createdById: user.id,
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
