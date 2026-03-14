import { Module, Get, Controller } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';

@Controller()
class HealthController {
  @Get('health')
  check() {
    return {
      status: 'healthy',
      service: 'Beefree SDK Angular + NestJS Auth Example',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TemplatesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
