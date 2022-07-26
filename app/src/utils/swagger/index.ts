import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('SNS API Server')
    .setDescription('SNS API 서버입니다')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Access Token 을 입력해주세요.',
        name: 'JWT',
        in: 'HTTP Header Authorization',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
