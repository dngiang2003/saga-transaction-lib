import { ILogger } from '../interfaces/logger.interface';

export class DefaultLogger implements ILogger {
  log(message: string): void {
    console.log(`[Saga] ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[Saga Error] ${message}`, error);
  }

  warn(message: string): void {
    console.warn(`[Saga Warning] ${message}`);
  }

  debug(message: string): void {
    console.debug(`[Saga Debug] ${message}`);
  }
}
