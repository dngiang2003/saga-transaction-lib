import { IErrorHandler } from '../interfaces/error-handler.interface';
import { ILogger } from '../interfaces/logger.interface';
import { TransactionContext } from '../types/transaction-context.type';
export declare class DefaultErrorHandler<TContext> implements IErrorHandler<TContext> {
    private readonly logger;
    constructor(logger: ILogger);
    handleError(error: Error, context: TransactionContext<TContext>): Promise<void>;
}
