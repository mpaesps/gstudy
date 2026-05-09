import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async student(studentId: string) {
    const [student, upcomingSessions, openGoals, indicators] = await Promise.all([
      this.prisma.student.findUnique({ where: { id: studentId }, include: { user: true, lifeProject: true } }),
      this.prisma.sessionParticipant.findMany({
        where: { studentId, session: { status: 'SCHEDULED' } },
        include: { session: true },
        take: 5,
      }),
      this.prisma.goal.findMany({ where: { studentId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.indicator.findMany({ where: { studentId }, orderBy: { referenceMonth: 'asc' }, take: 6 }),
    ]);

    return { student, upcomingSessions, openGoals, indicators };
  }

  async tutor(tutorId?: string) {
    const where = tutorId ? { tutorId } : {};
    const [todaySessions, studentsInTutoring, pendingGoals, recentSessions] = await Promise.all([
      this.prisma.tutoringSession.count({ where: { ...where, status: 'SCHEDULED' } }),
      this.prisma.sessionParticipant.count({ where: { session: where } }),
      this.prisma.goal.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.tutoringSession.findMany({
        where,
        include: { participants: { include: { student: { include: { user: true } } } } },
        orderBy: { scheduledAt: 'desc' },
        take: 8,
      }),
    ]);

    return { todaySessions, studentsInTutoring, pendingGoals, recentSessions };
  }

  async coordinator() {
    const [completedSessions, totalStudents, studentsWithoutFollowup, averageAttendance, overdueGoals] =
      await Promise.all([
        this.prisma.tutoringSession.count({ where: { status: 'COMPLETED' } }),
        this.prisma.student.count(),
        this.studentsWithoutFollowupCount(),
        this.averageAttendance(),
        this.prisma.goal.count({ where: { status: 'OVERDUE' } }),
      ]);

    return { completedSessions, totalStudents, studentsWithoutFollowup, averageAttendance, overdueGoals };
  }

  private async studentsWithoutFollowupCount() {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const students = await this.prisma.student.findMany({
      where: {
        participants: {
          none: {
            session: {
              status: 'COMPLETED',
              completedAt: { gte: since },
            },
          },
        },
      },
      select: { id: true },
    });

    return students.length;
  }

  private async averageAttendance() {
    const attendances = await this.prisma.attendance.findMany({ select: { present: true } });
    if (!attendances.length) {
      return 0;
    }

    const present = attendances.filter((attendance) => attendance.present).length;
    return Math.round((present / attendances.length) * 100);
  }
}
