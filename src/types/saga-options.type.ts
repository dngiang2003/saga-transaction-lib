import { ILogger } from '../interfaces/logger.interface';
import { IErrorHandler } from '../interfaces/error-handler.interface';

export type SagaOptions<TContext> = {
  logger?: ILogger;
  errorHandler?: IErrorHandler<TContext>;
  shouldStopOnError?: boolean;
}
