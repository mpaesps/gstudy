import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany({
      include: { user: true, classGroup: { include: { school: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        classGroup: { include: { school: true } },
        goals: true,
        lifeProject: true,
        indicators: { orderBy: { referenceMonth: 'desc' } },
      },
    });

    if (!student) {
      throw new NotFoundException('Aluno nao encontrado');
    }

    return student;
  }

  history(id: string) {
    return this.prisma.sessionParticipant.findMany({
      where: { studentId: id },
      include: {
        session: {
          include: {
            tutor: { include: { user: true } },
            attendances: { where: { studentId: id } },
          },
        },
      },
      orderBy: { session: { scheduledAt: 'desc' } },
    });
  }
}
