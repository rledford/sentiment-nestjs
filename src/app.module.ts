import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformModule } from './platform/platform.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PlatformModule,
    SentimentModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const mongoHost = config.get<string>('MONGO_HOST');
        const mongoPort = config.get<number>('MONGO_PORT');
        const mongoUser = config.get<string>('MONGO_USER');
        const mongoPass = config.get<string>('MONGO_PASS');
        const mongoName = config.get<string>('MONGO_NAME');

        return {
          uri: `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}`,
          dbName: mongoName,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
