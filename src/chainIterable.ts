import { chain } from ".";
import { selfSelector } from "./common";

interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): ChainIterable<S>
    (condition: (item: T, index: number) => boolean): ChainIterable<T>
}

export class ChainIterable<T> implements Iterable<T> {
    constructor(private readonly source: Iterable<T>) {
    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        return this.source[Symbol.iterator]();
    }

    get array(): T[] {
        return Array.from(this.source);
    }

    object = <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue): Record<TKey, TValue> => {
        valueSelector = valueSelector || selfSelector;
        const result: Record<TKey, TValue> = {} as any;
        for (const item of this.source) {
            const key = keySelector(item);
            if (key in result) {
                throw new Error("Duplicate key: " + key);
            }
            result[key] = valueSelector(item);
        }
        return result;
    }

    map = <R>(selector: (item: T, index: number) => R): ChainIterable<R> => {
        return chain.map(this.source, selector);
    }

    filter: FilterOverride<T> = (condition: (item: T, index: number) => boolean) => {
        return chain.filter(this.source, condition);
    }

    some = (condition?: (item: T, index: number) => boolean): boolean => {
        return chain.some(this.source, condition);
    }

    every = (condition?: (item: T, index: number) => boolean): boolean => {
        return chain.every(this.source, condition);
    }

    append = (element: T): ChainIterable<T> => {
        return chain.append(this.source, element);
    }

    prepend = (element: T): ChainIterable<T> => {
        return chain.prepend(this.source, element);
    }

    concat = <S>(other: Iterable<S>): ChainIterable<T | S> => {
        return chain.concat(this.source, other);
    }

    count = (condition?: (item: T, index: number) => boolean): number => {
        return chain.count(this.source, condition);
    }

    contains = (element: T, comparer?: (a: T, b: T) => boolean): boolean => {
        return chain.contains(this.source, element, comparer);
    }

    first = (condition?: (item: T, index: number) => boolean): T => {
        return chain.first(this.source, condition);
    }

    firstOreDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.firstOrDefault(this.source, defaultValue, condition);
    }

    single = (condition?: (item: T, index: number) => boolean): T => {
        return chain.single(this.source, condition);
    }

    singleOrDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.singleOrDefault(this.source, defaultValue, condition);
    }

    last = (condition?: (item: T, index: number) => boolean): T => {
        return chain.last(this.source, condition);
    }

    lastOrDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.lastOrDefault(this.source, defaultValue, condition);
    }

    skip = (count: number): ChainIterable<T> => {
        return chain.skip(this.source, count);
    }

    take = (count: number): ChainIterable<T> => {
        return chain.take(this.source, count);
    }

    reverse = (): ChainIterable<T> => {
        return chain.reverse(this.source);
    }

    distinct = (stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.distinct(this.source, stringifier);
    }

    except = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.except(this.source, other, stringifier);
    }

    intersect = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.intersect(this.source, other, stringifier);
    }

    union = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.union(this.source, other, stringifier);
    }

    groupBy = <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => {
        return chain.groupBy(this.source, keySelector, valueSelector);
    }

    groupComparedBy = <TKey, TValue = T>(keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) => {
        return chain.groupComparedBy(this.source, keySelector, keyComparer, valueSelector);
    }
}