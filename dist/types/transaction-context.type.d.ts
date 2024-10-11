import { IStep } from "../interfaces/step.interface";
export declare class TransactionContext<TContext> {
    readonly data: TContext;
    readonly metadata: Record<string, any>;
    private successfulSteps;
    constructor(data: TContext, metadata?: Record<string, any>);
    addSuccessfulStep(step: IStep<TContext>): void;
    getSuccessfulSteps(): IStep<TContext>[];
}
