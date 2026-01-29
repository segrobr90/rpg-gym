import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name?: string }) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  // ✅ rota protegida pra testar JWT
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return {
      user: req.user, // vem do JwtStrategy.validate()
    };
  }
}
