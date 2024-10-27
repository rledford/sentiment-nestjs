import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LanguageService } from 'src/platform/services/language.service';
import { LoggerService } from 'src/platform/services/logger.service';
import { SentimentDTO, SentimentScoreDTO } from './sentiment.dto';
import { Sentiment } from './sentiment.schema';

@Injectable()
export class SentimentService {
  constructor(
    private readonly logger: LoggerService,
    private readonly languageService: LanguageService,
    @InjectModel(Sentiment.name) private sentimentModel: Model<Sentiment>,
  ) {
    this.logger.setContext(SentimentService.name);
  }

  async computeSentimentScore(content: string): Promise<SentimentScoreDTO> {
    const contentLength = content.length;

    this.logger.log(`Computing sentiment for content: length=${contentLength}`);

    const startTime = Date.now();
    const { score, magnitude } = await this.languageService.analyze(content);
    const duration = Date.now() - startTime;

    const result = new SentimentScoreDTO();
    result.score = score;
    result.magnitude = magnitude;

    // should we fail here or catch the error
    // and log it, so we can still return the
    // result to the consumer
    await this.sentimentModel.create({
      score,
      magnitude,
      duration,
      content,
    });

    this.logger.log(
      `Computed sentiment for content: length=${contentLength} duration=${duration} score=${score} magnitude=${magnitude}`,
    );

    return result;
  }

  async getSentimentById(id: Types.ObjectId): Promise<SentimentDTO> {
    const result = await this.sentimentModel.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return this.sentimentToDTO(result);
  }

  async getAllSentiments(): Promise<SentimentDTO[]> {
    const sentiments = await this.sentimentModel.find();
    return sentiments.map(this.sentimentToDTO);
  }

  sentimentToDTO(sentiment: Sentiment): SentimentDTO {
    return {
      id: sentiment._id.toHexString(),
      score: sentiment.score,
      magnitude: sentiment.magnitude,
      duration: sentiment.duration,
      content: sentiment.content,
      createdAt: sentiment.createdAt,
      updatedAt: sentiment.updatedAt,
    };
  }
}
