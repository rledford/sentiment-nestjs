import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class SentimentInputDTO {
  @ApiProperty({ required: true })
  @IsString()
  @Length(1)
  content: string;
}

export class SentimentScoreDTO {
  @ApiProperty()
  score: number;
}

export class SentimentDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  score: number;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
}
