import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  disable() {
    this.setLogLevels([]);
  }
}
