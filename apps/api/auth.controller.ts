import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name?: string },
  ) {
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // depois a gente faz hash
        name: body.name,
      },
    });

    return {
      message: 'registered',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
