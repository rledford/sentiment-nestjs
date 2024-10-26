import { createMock } from '@golevelup/ts-jest';
import { LanguageServiceClient } from '@google-cloud/language';
import { Test, TestingModule } from '@nestjs/testing';
import { PlatformModule } from '../platform.module';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PlatformModule],
    }).compile();

    service = module.get<LanguageService>(LanguageService);
  });

  describe('analyze', () => {
    it('should get sentiment analysis', async () => {
      jest
        .spyOn(service.client, 'analyzeSentiment')
        .mockImplementationOnce(async () => [
          { documentSentiment: { score: 1.0, magnitude: 0.5 } },
        ]);

      const result = await service.analyze('test');
      expect(result).toMatchObject({ score: 1.0, magnitude: 0.5 });
    });

    it('should throw it is unable to get sentiment data', async () => {
      jest
        .spyOn(service.client, 'analyzeSentiment')
        .mockImplementationOnce(async () => [
          { missing: 'expected sentiment data' },
        ]);

      await expect(() => service.analyze('test')).rejects.toThrow(
        'Expected sentiment data in language analysis response.',
      );
    });
  });
});
