import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { LoggerService } from './services/logger.service';
import { LanguageService } from './services/language.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      validationSchema: configValidationSchema,
    }),
  ],
  exports: [LoggerService, LanguageService],
  providers: [LoggerService, LanguageService],
})
export class PlatformModule {}
