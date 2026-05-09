import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (existingUser) {
      throw new ConflictException('E-mail ja cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role,
        passwordHash,
      },
    });

    return this.toPublicUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.toPublicUser(user));
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id);

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role,
        status: dto.status,
        passwordHash,
      },
    });

    return this.toPublicUser(user);
  }

  async deactivate(id: string) {
    await this.ensureExists(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
    return this.toPublicUser(user);
  }

  private async ensureExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }
  }

  private toPublicUser(user: { id: string; name: string; email: string; role: string; status: string }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
