import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // depois a gente faz hash
        name: body.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return {
      message: 'registered',
      user,
    };
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || user.password !== body.password) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    return {
      message: 'logged in',
      token: 'jwt_fake_por_enquanto',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
