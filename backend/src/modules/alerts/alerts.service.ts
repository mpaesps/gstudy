import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.alert.findMany({
      include: { student: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async studentsWithoutFollowup() {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    return this.prisma.student.findMany({
      where: {
        participants: {
          none: { session: { status: 'COMPLETED', completedAt: { gte: since } } },
        },
      },
      include: { user: true, classGroup: true },
    });
  }
}
