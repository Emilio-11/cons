import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let origen;
  if (process.env.MODO === 'pruebas') {
    origen = '*';
  } else {
    origen = [process.env.CORS_ORIGINS];
  }
  app.enableCors({
    origin: origen,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  console.log('http://localhost:3024');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
