import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type == 'param' && metadata.data == 'id') {
      // convert id to a number
      value = +value;

      // check if value is a positive integer
      if (Number.isInteger(value) && value > 0) {
        return value;
      }
      throw new BadRequestException('ID must be a positive integer');
    }
    return value;
  }
}
