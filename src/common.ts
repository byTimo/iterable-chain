import { IterableChain } from "./iterableChain";

export const markerKey = Symbol("chain_key");
export const marker: any = { [markerKey]: true };
export const chainMarker = Symbol("iterable_chain");

export const defaultCondition = () => true;
export const defaultConditionByElement = <T>(x: T) => Boolean(x);
export const defaultComparer = <T>(a: T, b: T) => a === b;
export const selfSelector = <T>(x: T) => x as any;
export const selfToStringStringifier = <T>(x: T) => (x as any).toString();

export type Keyable = string | number | symbol;

export type KeyValue<TKey, TValue> = [TKey, TValue];

export function isIterable<T>(source: any): source is Iterable<T> {
    return Symbol.iterator in source;
}

export function isIterableChain<T>(source: object): source is IterableChain<T> {
    return chainMarker in source;
}

export type IterableObject<TValue = unknown, TKey extends Keyable = Keyable> = Record<TKey, TValue>
