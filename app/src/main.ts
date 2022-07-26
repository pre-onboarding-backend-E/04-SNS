import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from './utils';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, //형식 안맞으면 거절
      transform: true, //자동 자료형 변환
    }),
  );

  Swagger.setupSwagger(app);

  await app.listen(80);
}
bootstrap();
