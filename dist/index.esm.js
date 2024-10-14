import { first } from 'lodash';

class TransactionContext {
    constructor(data, metadata = {}) {
        this.data = data;
        this.metadata = metadata;
        this.successfulSteps = [];
    }
    addSuccessfulStep(step) {
        this.successfulSteps.unshift(step);
    }
    getSuccessfulSteps() {
        return [...this.successfulSteps];
    }
}

class DefaultLogger {
    log(message) {
        console.log(`[Saga] ${message}`);
    }
    error(message, error) {
        console.error(`[Saga Error] ${message}`, error);
    }
    warn(message) {
        console.warn(`[Saga Warning] ${message}`);
    }
    debug(message) {
        console.debug(`[Saga Debug] ${message}`);
    }
}

class DefaultErrorHandler {
    constructor(logger) {
        this.logger = logger;
    }
    async handleError(error, context) {
        this.logger.error('Saga transaction failed', error);
        const successfulSteps = context.getSuccessfulSteps();
        for (const step of successfulSteps) {
            try {
                this.logger.debug(`Compensating step: ${step.name}`);
                await step.compensate(context.data);
            }
            catch (compensationError) {
                this.logger.error(`Compensation failed for step ${step.name}`, compensationError);
            }
        }
    }
}

class Saga {
    constructor(options = {}) {
        var _a;
        this.isBreakStep = false;
        this.logger = options.logger || new DefaultLogger();
        this.errorHandler =
            options.errorHandler || new DefaultErrorHandler(this.logger);
        this.shouldStopOnError = (_a = options.shouldStopOnError) !== null && _a !== void 0 ? _a : true;
    }
    async execute(context, steps) {
        const transactionContext = new TransactionContext(context);
        for (const step of steps) {
            if (this.isBreakStep) {
                break;
            }
            try {
                this.logger.debug(`Executing step: ${step.name}`);
                await step.invoke(context);
                transactionContext.addSuccessfulStep(step);
                this.logger.log(`Successfully completed step: ${step.name}`);
            }
            catch (error) {
                await this.handleStepError(error, transactionContext);
                if (this.shouldStopOnError) {
                    throw error;
                }
            }
        }
        return transactionContext;
    }
    async handleStepError(error, context) {
        await this.errorHandler.handleError(error, context);
    }
}

function BeforeInvoke(fn) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            if (typeof fn === 'function' &&
                !(await fn({
                    instance: this,
                    context: first(args),
                }))) {
                this.isBreakStep = true;
                return;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function BeforeRevoke() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (this.isBreakStep) {
                return;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

export { BeforeInvoke, BeforeRevoke, DefaultErrorHandler, DefaultLogger, Saga, TransactionContext };
