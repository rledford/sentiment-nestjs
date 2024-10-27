import { LanguageServiceClient } from '@google-cloud/language';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';

@Injectable()
export class LanguageService {
  client: LanguageServiceClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(LanguageServiceClient.name);
    this.client = new LanguageServiceClient({
      apiKey: this.configService.get<string>('GNL_CLIENT_API_KEY'),
    });
  }

  async analyze(content: string): Promise<AnalyzeResult> {
    const [res] = await this.client.analyzeSentiment({
      document: {
        content,
        type: 'PLAIN_TEXT',
      },
    });

    const score = Number(res.documentSentiment?.score);
    const magnitude = Number(res.documentSentiment?.magnitude);

    if (isNaN(score) || isNaN(magnitude)) {
      this.logger.error(
        `Unexpected language analysis response:\n\t${JSON.stringify(res)}`,
      );

      throw new InternalServerErrorException(
        'Expected score and magnitude in language analysis response.',
      );
    }

    return {
      score,
      magnitude,
    };
  }
}

interface AnalyzeResult {
  score: number;
  magnitude: number;
}
