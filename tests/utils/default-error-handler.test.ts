import { DefaultErrorHandler } from '../../src/utils/default-error-handler';
import { DefaultLogger } from '../../src/utils/default-logger';
import { TransactionContext } from '../../src/types/transaction-context.type';
import { IStep } from '../../src/interfaces/step.interface';

interface TestContext {
  compensatedSteps: string[];
}

class TestStep implements IStep<TestContext> {
  constructor(public name: string) {}

  async invoke(_context: TestContext): Promise<void> {}

  async compensate(context: TestContext): Promise<void> {
    context.compensatedSteps.push(this.name);
  }
}

describe('DefaultErrorHandler', () => {
  let errorHandler: DefaultErrorHandler<TestContext>;
  let logger: DefaultLogger;
  let context: TransactionContext<TestContext>;

  beforeEach(() => {
    logger = new DefaultLogger();
    jest.spyOn(logger, 'error').mockImplementation();
    jest.spyOn(logger, 'debug').mockImplementation();

    errorHandler = new DefaultErrorHandler<TestContext>(logger);
    context = new TransactionContext<TestContext>({ compensatedSteps: [] });
  });

  test('should log error and compensate all successful steps', async () => {
    const error = new Error('Test error');
    const step1 = new TestStep('Step 1');
    const step2 = new TestStep('Step 2');

    context.addSuccessfulStep(step1);
    context.addSuccessfulStep(step2);

    await errorHandler.handleError(error, context);

    expect(logger.error).toHaveBeenCalledWith('Saga transaction failed', error);
    expect(context.data.compensatedSteps).toEqual(['Step 2', 'Step 1']);
    expect(logger.debug).toHaveBeenCalledWith('Compensating step: Step 2');
    expect(logger.debug).toHaveBeenCalledWith('Compensating step: Step 1');
  });

  test('should handle compensation errors gracefully', async () => {
    const error = new Error('Test error');
    const failingStep = new TestStep('Failing Step');
    jest.spyOn(failingStep, 'compensate').mockRejectedValue(new Error('Compensation failed'));

    context.addSuccessfulStep(failingStep);

    await errorHandler.handleError(error, context);

    expect(logger.error).toHaveBeenCalledWith(
      'Compensation failed for step Failing Step',
      expect.any(Error)
    );
  });

  test('should compensate steps in reverse order', async () => {
    const error = new Error('Test error');
    const step1 = new TestStep('Step 1');
    const step2 = new TestStep('Step 2');
    const step3 = new TestStep('Step 3');

    context.addSuccessfulStep(step1);
    context.addSuccessfulStep(step2);
    context.addSuccessfulStep(step3);

    await errorHandler.handleError(error, context);

    expect(context.data.compensatedSteps).toEqual(['Step 3', 'Step 2', 'Step 1']);
  });
});
