import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { LanguageService } from 'src/platform/services/language.service';
import { LoggerService } from 'src/platform/services/logger.service';
import { SentimentController } from './sentiment.controller';
import { SentimentModule } from './sentiment.module';
import { Sentiment } from './sentiment.schema';
import { SentimentService } from './sentiment.service';

describe('SentimentController', () => {
  let controller: SentimentController;
  let mockSentimentModel: Model<Sentiment>;
  let mockSentimentService: SentimentService;
  let mockLanguageService: LanguageService;
  let mockLoggerService: LoggerService;

  beforeEach(async () => {
    mockSentimentModel = createMock<Model<Sentiment>>();
    mockSentimentService = createMock<SentimentService>();
    mockLanguageService = createMock<LanguageService>();
    mockLoggerService = createMock<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken('Sentiment'), useValue: mockSentimentModel },
        { provide: SentimentService, useValue: mockSentimentService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: LanguageService, useValue: mockLanguageService },
        SentimentController,
      ],
    }).compile();

    controller = module.get<SentimentController>(SentimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
