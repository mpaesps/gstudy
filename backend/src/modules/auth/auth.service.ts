import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from './authenticated-user';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '1d' },
    );

    return {
      accessToken,
      user: await this.me({ id: user.id, email: user.email, role: user.role }),
    };
  }

  async me(authenticatedUser: AuthenticatedUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: authenticatedUser.id },
      include: {
        student: { include: { classGroup: { include: { school: true } } } },
        tutor: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario autenticado nao encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      student: user.student
        ? {
            id: user.student.id,
            registration: user.student.registration,
            classGroup: user.student.classGroup,
          }
        : null,
      tutor: user.tutor
        ? {
            id: user.tutor.id,
            subject: user.tutor.subject,
          }
        : null,
    };
  }
}
