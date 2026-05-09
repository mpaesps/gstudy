import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  tutoring() {
    return this.prisma.tutoringSession.findMany({
      include: { tutor: { include: { user: true } }, participants: true, attendances: true },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  attendance() {
    return this.prisma.attendance.findMany({
      include: { student: { include: { user: true } }, session: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  studentsWithoutFollowup() {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    return this.prisma.student.findMany({
      where: { participants: { none: { session: { completedAt: { gte: since } } } } },
      include: { user: true, classGroup: true },
    });
  }
}
