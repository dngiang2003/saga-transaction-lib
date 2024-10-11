export interface IStep<TContext, TResult = any> {
  name: string;
  invoke(context: TContext): Promise<TResult>;
  compensate(context: TContext): Promise<void>;
}
