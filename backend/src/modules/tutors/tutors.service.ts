import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class TutorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tutor.findMany({
      include: { user: true, sessions: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
