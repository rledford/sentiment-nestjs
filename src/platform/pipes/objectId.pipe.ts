import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<unknown, Types.ObjectId>
{
  transform(value: unknown): Types.ObjectId {
    const valueAsString = `${value}`;
    const isValidObjectId = Types.ObjectId.isValid(valueAsString);

    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ID');
    }

    return Types.ObjectId.createFromHexString(valueAsString);
  }
}
