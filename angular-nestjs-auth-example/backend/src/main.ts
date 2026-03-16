import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

export async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:8034' });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  /* istanbul ignore next */
  const port = process.env.PORT ?? 3034;
  await app.listen(port);

  logger.log(`🚀 NestJS server running at http://localhost:${port}`);
  logger.log(`   POST /auth/token — Authentication`);
  logger.log(`   GET  /template/sample — Sample template`);
  logger.log(`   GET  /template/blank — Blank template`);
  logger.log(`   GET  /health — Health check`);
}

if (process.env.NODE_ENV !== 'test') {
  void bootstrap();
}
