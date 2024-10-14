import { IStep } from './interfaces/step.interface';
import { SagaOptions } from './types/saga-options.type';
import { TransactionContext } from './types/transaction-context.type';
export declare class Saga<TContext> {
    private readonly logger;
    private readonly errorHandler;
    private readonly shouldStopOnError;
    isBreakStep: boolean;
    constructor(options?: SagaOptions<TContext>);
    execute(context: TContext, steps: IStep<TContext>[]): Promise<TransactionContext<TContext>>;
    private handleStepError;
}
