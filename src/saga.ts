import { IStep } from './interfaces/step.interface';
import { DefaultLogger } from './utils/default-logger';
import { ILogger } from './interfaces/logger.interface';
import { SagaOptions } from './types/saga-options.type';
import { DefaultErrorHandler } from './utils/default-error-handler';
import { IErrorHandler } from './interfaces/error-handler.interface';
import { TransactionContext } from './types/transaction-context.type';

export class Saga<TContext> {
  private readonly logger: ILogger;
  private readonly errorHandler: IErrorHandler<TContext>;
  private readonly shouldStopOnError: boolean;

  constructor(options: SagaOptions<TContext> = {}) {
    this.logger = options.logger || new DefaultLogger();
    this.errorHandler = options.errorHandler || new DefaultErrorHandler<TContext>(this.logger);
    this.shouldStopOnError = options.shouldStopOnError ?? true;
  }

  async execute(context: TContext, steps: IStep<TContext>[]): Promise<TransactionContext<TContext>> {
    const transactionContext = new TransactionContext(context);
    
    for (const step of steps) {
      try {
        this.logger.debug(`Executing step: ${step.name}`);
        await step.invoke(context);
        transactionContext.addSuccessfulStep(step);
        this.logger.log(`Successfully completed step: ${step.name}`);
      } catch (error) {
        await this.handleStepError(error as Error, transactionContext);
        if (this.shouldStopOnError) {
          throw error;
        }
      }
    }

    return transactionContext;
  }

  private async handleStepError(error: Error, context: TransactionContext<TContext>): Promise<void> {
    await this.errorHandler.handleError(error, context);
  }
}
