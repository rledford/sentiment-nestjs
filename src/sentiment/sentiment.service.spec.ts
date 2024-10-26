import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { LoggerService } from 'src/platform/services/logger.service';
import { LanguageService } from 'src/platform/services/language.service';
import { Sentiment } from './sentiment.schema';
import { SentimentService } from './sentiment.service';
import { generateSentiment, generateSentiments } from './test-utils/data';

describe('SentimentService', () => {
  let service: SentimentService;
  let mockSentimentModel: Model<Sentiment>;
  let mockLanguageService: LanguageService;
  let mockLoggerService: LoggerService;

  beforeEach(async () => {
    mockSentimentModel = createMock<Model<Sentiment>>();
    mockLanguageService = createMock<LanguageService>();
    mockLoggerService = createMock<LoggerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken('Sentiment'), useValue: mockSentimentModel },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: LanguageService, useValue: mockLanguageService },
        SentimentService,
      ],
    }).compile();

    service = module.get<SentimentService>(SentimentService);
  });

  describe('computeSentimentScore', () => {
    it('should return sentiment score', async () => {
      const sentimentScore = 1.0;
      const sentimentMag = 0.5;

      jest
        .spyOn(mockLanguageService, 'analyze')
        .mockImplementationOnce(async (_: string) => ({
          score: sentimentScore,
          magnitude: sentimentMag,
        }));

      const result = await service.computeSentimentScore('test');

      expect(mockLanguageService.analyze).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        score: sentimentScore,
        magnitude: sentimentMag,
      });
    });

    it('should save sentiment computation data', async () => {
      const sentimentScore = 1.0;
      const sentimentMag = 0.5;
      const sentimentContent = 'test';

      global.Date.now = () => 1;

      jest
        .spyOn(mockLanguageService, 'analyze')
        .mockImplementationOnce(async (_: string) => ({
          score: sentimentScore,
          magnitude: sentimentMag,
        }));

      await service.computeSentimentScore(sentimentContent);

      expect(mockSentimentModel.create).toHaveBeenCalledWith({
        score: sentimentScore,
        magnitude: sentimentMag,
        duration: 0,
        content: sentimentContent,
      });
    });
  });

  describe('sentimentToDTO', () => {
    it('should return a sentiment DTO', () => {
      const input = generateSentiment();

      expect(service.sentimentToDTO(input)).toMatchObject({
        id: input._id.toHexString(),
        score: input.score,
        content: input.content,
        duration: input.duration,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });
    });
  });

  describe('getAllSentiments', () => {
    it('should return all sentiments', async () => {
      const sentimentCount = 2;

      jest
        .spyOn(mockSentimentModel, 'find')
        .mockResolvedValueOnce(generateSentiments(sentimentCount));
      jest.spyOn(service, 'sentimentToDTO');

      const result = await service.getAllSentiments();

      expect(result.length).toBe(sentimentCount);
      expect(service.sentimentToDTO).toHaveBeenCalledTimes(sentimentCount);
    });
  });

  describe('getSentimentById', () => {
    it('should return an existing sentiment', async () => {
      const sentiment = generateSentiment();
      jest
        .spyOn(mockSentimentModel, 'findById')
        .mockResolvedValueOnce(sentiment);

      const result = await service.getSentimentById(
        sentiment._id.toHexString(),
      );

      expect(result.id).toBe(sentiment._id.toHexString());
    });

    it('should throw if id is invalid', async () => {
      jest.spyOn(mockSentimentModel, 'findById').mockResolvedValueOnce(null);
      await expect(() => service.getSentimentById('')).rejects.toThrow(
        'Invalid ID',
      );
    });

    it('should thow not found if sentiment does not exist', async () => {
      const hexId = new Types.ObjectId().toHexString();
      jest.spyOn(mockSentimentModel, 'findById').mockResolvedValueOnce(null);
      await expect(() => service.getSentimentById(hexId)).rejects.toThrow(
        'Not Found',
      );
    });
  });
});
