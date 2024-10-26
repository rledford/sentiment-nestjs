import { LanguageServiceClient } from '@google-cloud/language';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LanguageService {
  client: LanguageServiceClient;

  constructor(private readonly configService: ConfigService) {
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

    if (!res.documentSentiment) {
      throw new InternalServerErrorException(
        'Expected sentiment data in language analysis response.',
      );
    }

    return {
      score: res.documentSentiment?.score || 0,
      magnitude: res.documentSentiment?.magnitude || 0,
    };
  }
}

interface AnalyzeResult {
  score: number;
  magnitude: number;
}
