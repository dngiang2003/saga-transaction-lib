import { TransactionContext } from '../types/transaction-context.type';

export interface IErrorHandler<TContext> {
  handleError(error: Error, context: TransactionContext<TContext>): Promise<void>;
}
