import { SentimentDTO } from '../sentiment.dto';
import { Sentiment } from '../sentiment.schema';
import { Types } from 'mongoose';

export const generateSentiment = (): Sentiment => {
  const now = Date.now();
  const _id = new Types.ObjectId();
  const doc = new Sentiment();

  doc._id = _id;
  doc.score = 1.0;
  doc.duration = 1.0;
  doc.createdAt = new Date(now);
  doc.updatedAt = new Date(now);

  return doc;
};

export const generateSentiments = (count: number = 1): Sentiment[] => {
  return Array.from(Array(count)).map(generateSentiment);
};

export const generateSentimentDTO = (): SentimentDTO => {
  const now = Date.now();
  const dto = new SentimentDTO();

  dto.id = new Types.ObjectId().toHexString();
  dto.score = 1.0;
  dto.duration = 1.0;
  dto.createdAt = new Date(now);
  dto.updatedAt = new Date(now);

  return dto;
};

export const generateSentimentDTOs = (count: number = 1): SentimentDTO[] => {
  return Array.from(Array(count)).map(generateSentimentDTO);
};
