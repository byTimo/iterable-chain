export const markerKey = Symbol("chain_key");
export const marker: any = {[markerKey]: true};

export const defaultCondition = () => true;
export const defaultConditionByElement = <T>(x: T) => !!x;
export const defaultComparer = <T>(a: T, b: T) => a === b;
export const selfSelector = <T>(x: T) => x as any;

export interface KeyValue<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export function isIterable<T>(source: any): source is Iterable<T> {
    return Symbol.iterator in source;
}
