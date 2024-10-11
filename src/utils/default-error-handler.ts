import { IErrorHandler } from '../interfaces/error-handler.interface';
import { ILogger } from '../interfaces/logger.interface';
import { TransactionContext } from '../types/transaction-context.type';

export class DefaultErrorHandler<TContext> implements IErrorHandler<TContext> {
  constructor(private readonly logger: ILogger) {}

  async handleError(error: Error, context: TransactionContext<TContext>): Promise<void> {
    this.logger.error('Saga transaction failed', error);
    
    const successfulSteps = context.getSuccessfulSteps();
    for (const step of successfulSteps) {
      try {
        this.logger.debug(`Compensating step: ${step.name}`);
        await step.compensate(context.data);
      } catch (compensationError) {
        this.logger.error(
          `Compensation failed for step ${step.name}`, 
          compensationError as Error
        );
      }
    }
  }
}
