export type OptionBeforeInvoke<T, CLS> = {
    instance: CLS;
    context: T;
};
export declare function BeforeInvoke<CLS, T>(fn?: (option: OptionBeforeInvoke<T, CLS>) => Promise<boolean> | boolean): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function BeforeRevoke(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
