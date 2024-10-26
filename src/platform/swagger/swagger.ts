import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const builder = new DocumentBuilder()
    .setTitle('Sentiment API')
    .setDescription('Sentiment API Documentation')
    .setVersion('0.1.0')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, builder);

  SwaggerModule.setup('api', app, swaggerDoc);
};
