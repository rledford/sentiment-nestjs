import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { LoggerService } from './services/logger.service';
import { VertexService } from './services/vertex.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      validationSchema: configValidationSchema,
    }),
  ],
  exports: [LoggerService, VertexService],
  providers: [LoggerService, VertexService],
})
export class PlatformModule {}
