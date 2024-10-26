import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from 'src/platform/services/logger.service';
import { VertexService } from 'src/platform/services/vertex.service';
import { SentimentScoreDTO, SentimentDTO } from './sentiment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sentiment } from './sentiment.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class SentimentService {
  constructor(
    private readonly logger: LoggerService,
    private readonly vertexService: VertexService,
    @InjectModel(Sentiment.name) private sentimentModel: Model<Sentiment>,
  ) {
    this.logger.setContext(SentimentService.name);
  }

  async computeSentimentScore(content: string): Promise<SentimentScoreDTO> {
    const contentLength = content.length;

    this.logger.log(`Computing sentiment for content: length=${contentLength}`);

    const startTime = Date.now();
    const score = await this.vertexService.analyze(content);
    const duration = Date.now() - startTime;

    const result = new SentimentScoreDTO();
    result.score = score;

    // should we fail here or catch the error
    // and log it, so we can still return the
    // result to the consumer
    await this.sentimentModel.create({
      score,
      duration,
      content,
    });

    this.logger.log(
      `Computed sentiment for content: length=${contentLength} duration=${duration} score=${score}`,
    );

    return result;
  }

  async getSentimentById(id: string): Promise<SentimentDTO> {
    let result: Sentiment | null;

    try {
      const _id = Types.ObjectId.createFromHexString(id);
      result = await this.sentimentModel.findById(_id);
    } catch (err) {
      switch (err.name) {
        case 'BSONError':
          throw new BadRequestException('Invalid ID');
        default:
          throw err;
      }
    }

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
      duration: sentiment.duration,
      content: sentiment.content,
      createdAt: sentiment.createdAt,
      updatedAt: sentiment.updatedAt,
    };
  }
}
