import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, TutoringStatus, TutoringType } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { CompleteTutoringSessionDto } from './dto/complete-tutoring-session.dto';
import { CreateTutoringSessionDto } from './dto/create-tutoring-session.dto';

@Injectable()
export class TutoringSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTutoringSessionDto) {
    if (dto.type === TutoringType.INDIVIDUAL && dto.studentIds.length !== 1) {
      throw new BadRequestException('Tutoria individual deve possuir exatamente um aluno');
    }

    const tutor = await this.prisma.tutor.findUnique({ where: { id: dto.tutorId } });
    if (!tutor) {
      throw new NotFoundException('Tutor responsavel nao encontrado');
    }

    return this.prisma.tutoringSession.create({
      data: {
        tutorId: dto.tutorId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        scheduledAt: new Date(dto.scheduledAt),
        periodicity: dto.periodicity,
        participants: {
          create: dto.studentIds.map((studentId) => ({ studentId })),
        },
      },
      include: this.defaultInclude(),
    });
  }

  async findAll(user: AuthenticatedUser) {
    const sessions = await this.prisma.tutoringSession.findMany({
      where: await this.visibilityWhere(user),
      orderBy: { scheduledAt: 'desc' },
      include: this.defaultInclude(),
    });

    return sessions.map((session) => this.withCalendarStatus(session));
  }

  async findOne(id: string, user?: AuthenticatedUser) {
    const session = await this.prisma.tutoringSession.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!session) {
      throw new NotFoundException('Tutoria nao encontrada');
    }

    if (user) {
      const visibleSessions = await this.prisma.tutoringSession.count({
        where: {
          id,
          ...(await this.visibilityWhere(user)),
        },
      });

      if (!visibleSessions) {
        throw new NotFoundException('Tutoria nao encontrada');
      }
    }

    return this.withCalendarStatus(session);
  }

  async complete(id: string, dto: CompleteTutoringSessionDto) {
    const session = await this.findOne(id);
    const participantIds = session.participants.map((participant) => participant.studentId);
    const attendanceIds = dto.attendance.map((item) => item.studentId);
    const hasAllParticipants = participantIds.every((studentId) => attendanceIds.includes(studentId));

    if (!hasAllParticipants) {
      throw new BadRequestException('A frequencia deve ser registrada para todos os participantes');
    }

    return this.prisma.tutoringSession.update({
      where: { id },
      data: {
        observations: dto.observations,
        completedAt: new Date(),
        status: TutoringStatus.COMPLETED,
        attendances: {
          create: dto.attendance.map((item) => ({
            studentId: item.studentId,
            present: item.present,
            notes: item.notes,
          })),
        },
      },
      include: this.defaultInclude(),
    });
  }

  private async visibilityWhere(user: AuthenticatedUser) {
    if (user.role === Role.COORDINATOR || user.role === Role.ADMIN) {
      return {};
    }

    if (user.role === Role.TUTOR) {
      const tutor = await this.prisma.tutor.findUnique({ where: { userId: user.id } });
      return tutor ? { tutorId: tutor.id } : { id: '__not_found__' };
    }

    const student = await this.prisma.student.findUnique({ where: { userId: user.id } });
    return student ? { participants: { some: { studentId: student.id } } } : { id: '__not_found__' };
  }

  private withCalendarStatus<T extends { scheduledAt: Date; status: TutoringStatus }>(session: T) {
    if (session.status === TutoringStatus.SCHEDULED && session.scheduledAt < new Date()) {
      return { ...session, calendarStatus: TutoringStatus.MISSED };
    }

    return { ...session, calendarStatus: session.status };
  }

  private defaultInclude() {
    return {
      tutor: { include: { user: true } },
      participants: { include: { student: { include: { user: true, classGroup: true } } } },
      attendances: true,
    };
  }
}
