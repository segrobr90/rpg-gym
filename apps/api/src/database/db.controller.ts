import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('db')
export class DbController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('ping')
  async ping() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  }
}
