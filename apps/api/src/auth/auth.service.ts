import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(input: { email: string; password: string; name?: string }) {
    const email = input.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: input.name,

        // 🎮 CAMPOS RPG (compatíveis com o schema atual)
        level: 1,
        xp: 0,
        gold: 0,
        str: 1,
        dex: 1,
        int: 1,
        vit: 1,
      },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        xp: true,
        gold: true,
        str: true,
        dex: true,
        int: true,
        vit: true,
        createdAt: true,
      },
    });

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'registered',
      token,
      user,
    };
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        level: true,
        xp: true,
        gold: true,
        str: true,
        dex: true,
        int: true,
        vit: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'logged in',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        str: user.str,
        dex: user.dex,
        int: user.int,
        vit: user.vit,
      },
    };
  }
}
