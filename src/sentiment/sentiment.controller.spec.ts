import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { LanguageService } from 'src/platform/services/language.service';
import { LoggerService } from 'src/platform/services/logger.service';
import { SentimentController } from './sentiment.controller';
import { Sentiment } from './sentiment.schema';
import { SentimentService } from './sentiment.service';
import { generateSentimentDTO, generateSentimentDTOs } from './test-utils/data';

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

  describe('compute', () => {
    it('should repsond with the computed score data', async () => {
      const expected = { score: 1.0, magnitude: 0.5 };
      jest
        .spyOn(mockSentimentService, 'computeSentimentScore')
        .mockResolvedValue(expected);

      const result = await controller.compute({ content: 'test' });

      expect(result).toMatchObject(expected);
    });
  });

  describe('getOne', () => {
    it('should return sentiment record', async () => {
      const expected = generateSentimentDTO();
      jest
        .spyOn(mockSentimentService, 'getSentimentById')
        .mockImplementationOnce(async (_: string) => expected);

      const result = await controller.getOne(expected.id);

      expect(result).toBe(expected);
    });

    it('should return error if service throws', async () => {
      jest
        .spyOn(mockSentimentService, 'getSentimentById')
        .mockImplementationOnce((async () => {
          throw new Error('error');
        }) as jest.Mock);

      await expect(() => controller.getOne('test')).rejects.toThrow('error');
    });
  });

  describe('getAll', () => {
    it('should return all sentiment records', async () => {
      const expected = generateSentimentDTOs(2);
      jest
        .spyOn(mockSentimentService, 'getAllSentiments')
        .mockResolvedValue(expected);

      const result = await controller.getAll();

      expect(result).toMatchObject(expected);
    });
  });
});
