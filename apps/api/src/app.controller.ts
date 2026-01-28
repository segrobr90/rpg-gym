import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Rota raiz: útil pra status rápido no browser
  @Get()
  root() {
    return {
      name: 'rpg-gym-api',
      status: 'online',
    };
  }

  // Base da API
  @Get('api')
  api() {
    return 'RPG Gym API Online';
  }

  // Healthcheck (ideal para monitoramento)
  @Get('api/health')
  health() {
    return { status: 'ok' };
  }
}
