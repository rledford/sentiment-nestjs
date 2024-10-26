import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './platform/services/logger.service';
import helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as nocache from 'nocache';
import { setupSwagger } from './platform/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const accessLogger = new LoggerService();
  accessLogger.setContext('Access');

  app.enableCors({
    maxAge: 7200,
  });

  app.use(helmet());
  app.use(nocache());
  app.use(compression());

  app.use(
    morgan(
      ':remote-addr :method :url HTTP/:http-version :status - :res[content-length] :response-time ms :total-time ms',
      {
        stream: {
          write: (str: string) => accessLogger.log(str),
        },
      },
    ),
  );

  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  const port = Number(configService.get<number>('PORT'));

  await app.listen(port);
}

bootstrap();
