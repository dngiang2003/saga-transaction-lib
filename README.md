# Saga Transaction Library

A TypeScript library for implementing the Saga pattern to manage distributed transactions and complex workflows.

## Features

- TypeScript-first implementation
- Flexible and extensible architecture
- Built-in error handling and compensation
- Customizable logging
- Transaction context management
- Decorators for fine-grained control over step execution and compensation

## Installation

```bash
npm install saga-transaction-lib
```

## Configuration

### TypeScript Configuration

To use the decorators in this library, you need to enable experimental decorators in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
    // ... other options
  }
}
```

## Basic Usage

```typescript
import { Saga, IStep } from 'saga-transaction-lib';

// 1. Define your context type
interface MyContext {
  // your context properties
}

// 2. Implement your steps
class MyStep implements IStep<MyContext> {
  name = 'My Step';

  async invoke(context: MyContext): Promise<void> {
    // Implementation
  }

  async compensate(context: MyContext): Promise<void> {
    // Compensation logic
  }
}

// 3. Create and execute the saga
async function runMyTransaction() {
  const saga = new Saga<MyContext>();
  const context: MyContext = {
    /* ... */
  };
  const steps: IStep<MyContext>[] = [new MyStep()];

  try {
    const result = await saga.execute(context, steps);
    console.log('Transaction completed successfully');
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}
```

## Advanced Usage

### Using Decorators

The library provides two decorators for fine-grained control over step execution and compensation:

#### @BeforeInvoke & @BeforeCompensate()

- The @BeforeInvoke decorator checks if the step can proceed by returning true. If it does, the invoke method is executed.
- The @BeforeCompensate decorator does not require any condition checks and will directly execute the compensation logic when necessary.

```typescript
import { BeforeInvoke, IStep } from 'saga-transaction-lib';

class MyStep implements IStep<MyContext> {
  name = 'My Step';

  @BeforeInvoke<MyStep, MyContext>(async ({ instance, context }) => {
    console.log(`Preparing to execute ${instance.name}`);
    // Perform checks or preparations
    return true; // Return true to proceed, false to skip this step
  })
  async invoke(context: MyContext): Promise<void> {
    // Step implementation
  }

  @BeforeCompensate()
  async compensate(context: MyContext): Promise<void> {
    // Compensation logic
  }
}
```

### Custom Logger

```typescript
import { ILogger } from 'saga-transaction-lib';

class CustomLogger implements ILogger {
  log(message: string): void {
    // Custom implementation
  }

  error(message: string, error?: Error): void {
    // Custom implementation
  }

  warn(message: string): void {
    // Custom implementation
  }

  debug(message: string): void {
    // Custom implementation
  }
}
```

### Custom Error Handler

```typescript
import { IErrorHandler, TransactionContext } from 'saga-transaction-lib';

class CustomErrorHandler<TContext>
  implements IErrorHandler<TransactionContext<TContext>>
{
  async handleError(
    error: Error,
    context: TransactionContext<TContext>
  ): Promise<void> {
    // Custom error handling logic
  }
}
```

### NestJS Saga Module

```typescript
// saga.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { Saga, SagaOptions } from 'saga-transaction-lib';

@Module({})
export class SagaModule {
  static forRoot<TContext>(options?: SagaOptions<TContext>): DynamicModule {
    return {
      module: SagaModule,
      providers: [
        {
          provide: 'SAGA',
          useFactory: () => new Saga<TContext>(options),
        },
      ],
      exports: ['SAGA'],
    };
  }
}

// app.module.ts
@Module({
  imports: [
    SagaModule.forRoot<YourContextType>({
      logger: new CustomLogger(),
    }),
  ],
})
export class AppModule {}

// your.service.ts
@Injectable()
export class YourService {
  constructor(
    @Inject('SAGA')
    private readonly saga: Saga<YourContextType>
  ) {}

  async executeTransaction() {
    // Use saga here
  }
}
```

## Best Practices

1. Keep steps atomic and focused
2. Implement proper compensation logic
3. Use meaningful step names
4. Handle errors appropriately
5. Use typing to ensure compile-time safety
6. Use decorators to add pre-execution and pre-compensation logic when needed
7. Ensure `isBreakStep` is properly managed in your step implementations

## Example Usage

A detailed example can be found in the [`main.ts`](https://github.com/dngiang2003/saga-transaction-lib/example/main.ts) file located in the `example` folder. This example demonstrates how to implement a transaction step using both the `@BeforeInvoke` and `@BeforeCompensate` decorators.

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## Support

If you have any questions or need help, please open an issue on GitHub.
