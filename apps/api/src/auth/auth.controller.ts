import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('register')
  async register(
    @Body()
    body: { email: string; password: string; name?: string },
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name ?? 'Player',
      },
    });

    return {
      message: 'registered',
      user: { id: user.id, email: user.email, name: user.name },
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
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
