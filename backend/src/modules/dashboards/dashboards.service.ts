import { ForbiddenException, Injectable } from '@nestjs/common';
import { GoalStatus, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/authenticated-user';

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async student(studentId: string, user?: AuthenticatedUser) {
    if (user?.role === Role.STUDENT) {
      const studentOwner = await this.prisma.student.findFirst({ where: { id: studentId, userId: user.id } });
      if (!studentOwner) {
        throw new ForbiddenException('Aluno pode acessar apenas o proprio dashboard');
      }
    }

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

  async tutor(tutorId?: string, user?: AuthenticatedUser) {
    const authenticatedTutor =
      user?.role === Role.TUTOR ? await this.prisma.tutor.findUnique({ where: { userId: user.id } }) : null;
    const effectiveTutorId = user?.role === Role.TUTOR ? authenticatedTutor?.id ?? '__not_found__' : tutorId;
    const where = effectiveTutorId ? { tutorId: effectiveTutorId } : {};
    const studentWhere = effectiveTutorId ? { participants: { some: { session: { tutorId: effectiveTutorId } } } } : {};
    const goalWhere = {
      status: { in: [GoalStatus.OPEN, GoalStatus.IN_PROGRESS] },
      student: studentWhere,
    };

    const [scheduledSessions, studentsInTutoringList, pendingGoalsList, recentSessions] = await Promise.all([
      this.prisma.tutoringSession.findMany({
        where: { ...where, status: 'SCHEDULED' },
        include: { tutor: { include: { user: true } }, participants: { include: { student: { include: { user: true } } } } },
        orderBy: { scheduledAt: 'asc' },
      }),
      this.prisma.student.findMany({
        where: studentWhere,
        include: { user: true, classGroup: true },
        orderBy: { user: { name: 'asc' } },
      }),
      this.prisma.goal.findMany({
        where: goalWhere,
        include: { student: { include: { user: true, classGroup: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      this.prisma.tutoringSession.findMany({
        where,
        include: { tutor: { include: { user: true } }, participants: { include: { student: { include: { user: true } } } } },
        orderBy: { scheduledAt: 'desc' },
        take: 8,
      }),
    ]);

    return {
      todaySessions: scheduledSessions.length,
      studentsInTutoring: studentsInTutoringList.length,
      pendingGoals: pendingGoalsList.length,
      scheduledSessions,
      studentsInTutoringList,
      pendingGoalsList,
      recentSessions,
    };
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
