import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './objectId.pipe';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseObjectIdPipe],
    }).compile();

    pipe = module.get<ParseObjectIdPipe>(ParseObjectIdPipe);
  });

  it('should transform the provided string into an ObjectId', () => {
    const id = new Types.ObjectId();
    const hexId = id.toHexString();
    const result = pipe.transform(hexId);
    expect(result.toHexString()).toBe(hexId);
  });

  it('should throw if string is invalid', () => {
    expect(() => pipe.transform('invalid')).toThrow('Invalid ID');
  });
});
