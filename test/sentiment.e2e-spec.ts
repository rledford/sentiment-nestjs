import { createMock } from '@golevelup/ts-jest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { LanguageService } from 'src/platform/services/language.service';
import { Sentiment } from 'src/sentiment/sentiment.schema';
import {
  generateSentiment,
  generateSentiments,
} from 'src/sentiment/test-utils/data';
import * as request from 'supertest';

const endpoint = '/sentiments';

describe('SentimentController (e2e)', () => {
  let app: INestApplication;
  let sentimentModel: Model<Sentiment>;
  let languageService: LanguageService;

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: LanguageService, useValue: createMock<LanguageService>() },
      ],
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    sentimentModel = app.get<Model<Sentiment>>(getModelToken(Sentiment.name));
    languageService = app.get<LanguageService>(LanguageService);

    await sentimentModel.deleteMany({});

    await app.init();
  });

  describe(`${endpoint} (POST)`, () => {
    it('should respond with sentiment score data', async () => {
      const expected = { score: 1.0, magnitude: 0.5 };
      jest.spyOn(languageService, 'analyze').mockResolvedValueOnce(expected);
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ content: 'test' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toMatchObject(expected);
        });
    });

    it('should respond with error if input is invalid', async () => {
      await request(app.getHttpServer())
        .post(endpoint)
        .send({ missing: 'content' })
        .expect(400);
    });
  });

  describe(`${endpoint} (GET)`, () => {
    it('should respond with all sentiments', async () => {
      const expectedCount = 2;
      await Promise.all(
        generateSentiments(expectedCount).map((s) => sentimentModel.create(s)),
      );

      await request(app.getHttpServer())
        .get(endpoint)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(expectedCount);
        });
    });
  });

  describe(`${endpoint}/:id (GET)`, () => {
    let sentiment: Sentiment;

    beforeEach(async () => {
      sentiment = await sentimentModel.create(generateSentiment());
    });

    it('should respond with sentiment that has :id', async () => {
      const hexId = sentiment._id.toHexString();
      await request(app.getHttpServer())
        .get(`${endpoint}/${hexId}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            id: hexId,
          });
        });
    });

    it('should respond with error if id is invalid', async () => {
      await request(app.getHttpServer())
        .get(`${endpoint}/invalid-id`)
        .expect(400);
    });

    it('should respond with error if sentiment not found', async () => {
      const hexId = new Types.ObjectId().toHexString();
      await request(app.getHttpServer())
        .get(`${endpoint}/${hexId}`)
        .expect(404);
    });
  });
});
