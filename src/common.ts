export const markerKey = Symbol("chain_key");
export const marker: any = {[markerKey]: true};

export const defaultCondition = () => true;
export const defaultConditionByElement = <T>(x: T) => !!x;
export const defaultComparer = <T>(a: T, b: T) => a === b;
export const selfSelector = <T>(x: T) => x as any;
export type IterableItem<TIterable> = TIterable extends Iterable<infer T> ? T : never;

export interface KeyValue<TKey, TValue> {
    key: TKey;
    value: TValue;
}
