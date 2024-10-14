import { Saga, IStep, BeforeInvoke, BeforeRevoke } from 'saga-transaction-lib';

interface OrderContext {
  orderId: string;
  userId: string;
  amount: number;
}

class CreateOrderStep implements IStep<OrderContext> {
  name = 'Create Order';

  @BeforeInvoke<CreateOrderStep, OrderContext>(({ context }) => {
    return context.amount > 100;
  })
  async invoke(context: OrderContext): Promise<void> {
    console.log(`Creating order ${context.orderId}`);
  }

  @BeforeRevoke()
  async compensate(context: OrderContext): Promise<void> {
    console.log(`Cancelling order ${context.orderId}`);
  }
}

class ProcessPaymentStep implements IStep<OrderContext> {
  name = 'Process Payment';

  async invoke(context: OrderContext): Promise<void> {
    console.log(
      `Processing payment of ${context.amount} for order ${context.orderId}`
    );

    if (Math.random() < 0.5) {
      throw new Error('Payment failed');
    }
  }

  async compensate(context: OrderContext): Promise<void> {
    console.log(`Refunding payment for order ${context.orderId}`);
  }
}

class UpdateInventoryStep implements IStep<OrderContext> {
  name = 'Update Inventory';

  async invoke(context: OrderContext): Promise<void> {
    console.log(`Updating inventory for order ${context.orderId}`);
  }

  async compensate(context: OrderContext): Promise<void> {
    console.log(`Restoring inventory for order ${context.orderId}`);
  }
}

async function runOrderSaga() {
  const saga = new Saga<OrderContext>();
  const context: OrderContext = {
    orderId: 'ORD-001',
    userId: 'USR-001',
    amount: 1000,
  };

  const steps: IStep<OrderContext>[] = [
    new CreateOrderStep(),
    new ProcessPaymentStep(),
    new UpdateInventoryStep(),
  ];

  try {
    const result = await saga.execute(context, steps);
    console.log('Order process completed successfully');
  } catch (error) {
    console.error('Order process failed:', error);
  }
}

runOrderSaga();
