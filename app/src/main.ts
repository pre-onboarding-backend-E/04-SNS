import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Social Networking Service') // 문서 제목
    .setDescription(
      '사용자는 서비스를 통해 게시물을 업로드 하거나, 다른 사람의 게시물을 확인할 수 있습니다.',
    ) // 문서 설명
    .setVersion('1.0') // 문서 버전
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
