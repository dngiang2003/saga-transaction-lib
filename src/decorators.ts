import { first } from 'lodash';

export type OptionBeforeInvoke<T, CLS> = {
  instance: CLS;
  context: T;
};

export function BeforeInvoke<CLS, T>(
  fn?: (option: OptionBeforeInvoke<T, CLS>) => Promise<boolean> | boolean
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (
        typeof fn === 'function' &&
        !(await fn({
          instance: this,
          context: first(args),
        }))
      ) {
        this.isBreakStep = true;
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function BeforeRevoke() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (this.isBreakStep) {
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
