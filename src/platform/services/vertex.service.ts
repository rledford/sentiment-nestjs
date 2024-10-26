import { Injectable } from '@nestjs/common';

@Injectable()
export class VertexService {
  async analyze(text: string): Promise<number> {
    return Promise.resolve(text.length);
  }
}
