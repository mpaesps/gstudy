import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TutoringStatus, TutoringType } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
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

  findAll() {
    return this.prisma.tutoringSession.findMany({
      orderBy: { scheduledAt: 'desc' },
      include: this.defaultInclude(),
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.tutoringSession.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!session) {
      throw new NotFoundException('Tutoria nao encontrada');
    }

    return session;
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

  private defaultInclude() {
    return {
      tutor: { include: { user: true } },
      participants: { include: { student: { include: { user: true, classGroup: true } } } },
      attendances: true,
    };
  }
}
