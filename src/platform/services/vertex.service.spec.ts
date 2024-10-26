import { Test, TestingModule } from '@nestjs/testing';
import { PlatformModule } from '../platform.module';
import { VertexService } from './vertex.service';

describe('SentimentController', () => {
  let service: VertexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PlatformModule],
    }).compile();

    service = module.get<VertexService>(VertexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
