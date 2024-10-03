// Autobind decorator
export function autobind(
  _: any,
  _2: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;

  const adjustedDescriptor: TypedPropertyDescriptor<any> = {
    configurable: true,
    get() {
      const boundMethod = originalMethod!.bind(this);
      return boundMethod;
    },
  };

  return adjustedDescriptor;
}
