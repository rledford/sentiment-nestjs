import { Test, TestingModule } from '@nestjs/testing';
import { SentimentController } from './sentiment.controller';
import { SentimentModule } from './sentiment.module';

describe('SentimentController', () => {
  let controller: SentimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SentimentModule],
    }).compile();

    controller = module.get<SentimentController>(SentimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
