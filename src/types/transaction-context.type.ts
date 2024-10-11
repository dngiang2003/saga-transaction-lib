import { IStep } from "../interfaces/step.interface";

export class TransactionContext<TContext> {
  private successfulSteps: IStep<TContext>[] = [];

  constructor(
    public readonly data: TContext,
    public readonly metadata: Record<string, any> = {}
  ) {}

  addSuccessfulStep(step: IStep<TContext>): void {
    this.successfulSteps.unshift(step);
  }

  getSuccessfulSteps(): IStep<TContext>[] {
    return [...this.successfulSteps];
  }
}
