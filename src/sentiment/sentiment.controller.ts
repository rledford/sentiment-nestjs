import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  SentimentDTO,
  SentimentInputDTO,
  SentimentScoreDTO,
} from './sentiment.dto';
import { SentimentService } from './sentiment.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/platform/pipes/objectId.pipe';

@ApiTags('sentiments')
@Controller('sentiments')
export class SentimentController {
  constructor(private readonly service: SentimentService) {}

  @Post()
  @ApiOperation({ summary: 'Compute the sentiment of text' })
  @ApiOkResponse({ type: SentimentScoreDTO })
  @ApiBadRequestResponse()
  async compute(@Body() input: SentimentInputDTO): Promise<SentimentScoreDTO> {
    return this.service.computeSentimentScore(input.content);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a recorded sentiment computation by id',
  })
  @ApiParam({ name: 'id', type: Types.ObjectId })
  @ApiOkResponse({ type: SentimentDTO })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async getOne(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<SentimentDTO> {
    return this.service.getSentimentById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recorded sentiment computations' })
  @ApiOkResponse({ type: [SentimentDTO] })
  async getAll(): Promise<SentimentDTO[]> {
    return await this.service.getAllSentiments();
  }
}
