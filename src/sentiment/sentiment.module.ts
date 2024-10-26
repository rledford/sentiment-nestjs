import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { SentimentController } from './sentiment.controller';
import { PlatformModule } from 'src/platform/platform.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sentiment, SentimentSchema } from './sentiment.schema';

@Module({
  imports: [
    PlatformModule,
    MongooseModule.forFeature([
      { name: Sentiment.name, schema: SentimentSchema },
    ]),
  ],
  providers: [SentimentService],
  controllers: [SentimentController],
})
export class SentimentModule {}
