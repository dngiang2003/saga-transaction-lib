import { Saga } from '../src/saga';
import { IStep } from '../src/interfaces/step.interface';
import { TransactionContext } from '../src/types/transaction-context.type';

interface TestContext {
  value: number;
  steps: string[];
}

class SuccessfulStep implements IStep<TestContext> {
  name = 'Successful Step';

  async invoke(context: TestContext): Promise<void> {
    context.value += 1;
    context.steps.push(this.name);
  }

  async compensate(context: TestContext): Promise<void> {
    context.value -= 1;
    context.steps.push(`${this.name} Compensated`);
  }
}

class FailingStep implements IStep<TestContext> {
  name = 'Failing Step';

  async invoke(_context: TestContext): Promise<void> {
    throw new Error('Step failed');
  }

  async compensate(context: TestContext): Promise<void> {
    context.steps.push(`${this.name} Compensated`);
  }
}

describe('Saga', () => {
  let saga: Saga<TestContext>;
  let context: TestContext;

  beforeEach(() => {
    saga = new Saga<TestContext>();
    context = { value: 0, steps: [] };
  });

  test('should execute all steps successfully', async () => {
    const steps = [new SuccessfulStep(), new SuccessfulStep()];
    
    const result = await saga.execute(context, steps);
    
    expect(result.data.value).toBe(2);
    expect(result.data.steps).toEqual(['Successful Step', 'Successful Step']);
  });

  test('should compensate successful steps when a step fails', async () => {
    const steps = [new SuccessfulStep(), new FailingStep()];
    
    await expect(saga.execute(context, steps)).rejects.toThrow('Step failed');
    
    expect(context.value).toBe(0);
    expect(context.steps).toEqual([
      'Successful Step',
      'Failing Step Compensated',
      'Successful Step Compensated'
    ]);
  });

  test('should not execute remaining steps after failure when shouldStopOnError is true', async () => {
    const sagaWithStop = new Saga<TestContext>({ shouldStopOnError: true });
    const steps = [new SuccessfulStep(), new FailingStep(), new SuccessfulStep()];
    
    await expect(sagaWithStop.execute(context, steps)).rejects.toThrow('Step failed');
    
    expect(context.steps).not.toContain('Successful Step');
  });
});
