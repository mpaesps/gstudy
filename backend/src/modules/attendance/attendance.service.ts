import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  findByStudent(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: { session: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
