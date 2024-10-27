import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';
import { LoggerService } from './services/logger.service';
import { LanguageService } from './services/language.service';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !NODE_ENV ? '.env' : `.env.${NODE_ENV}.local`,
      validationSchema: configValidationSchema,
    }),
  ],
  exports: [LoggerService, LanguageService],
  providers: [LoggerService, LanguageService],
})
export class PlatformModule {}
