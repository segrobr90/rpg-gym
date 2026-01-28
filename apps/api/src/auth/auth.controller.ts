import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() body: { email: string; password: string; name?: string }) {
    return {
      message: 'registered (mock)',
      user: { id: 'u_1', email: body.email, name: body.name ?? 'Player' },
    };
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return {
      message: 'logged in (mock)',
      token: 'mock.jwt.token',
      user: { id: 'u_1', email: body.email },
    };
  }
}
