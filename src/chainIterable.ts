import { chain } from ".";
import { selfSelector, IterableItem, KeyValue } from "./common";


interface A<T> extends Iterable<T> {
    toArray: () => T[];
    toObject: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Record<TKey, TValue>;
    toMap: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Map<TKey, TValue>;
    toSet: () => Set<T>;
    map: <R>(selector: (item: T, index: number) => R) => Q<R>;
    filter: FilterOverride<T>;
    some: (condition?: (item: T, index: number) => boolean) => boolean;
    every: (condition?: (item: T, index: number) => boolean) => boolean;
    append: (element: T) => Q<T>;
    prepend: (element: T) => Q<T>;
    concat: <S>(other: Iterable<S>) => Q<T | S>;
    count: (condition?: (item: T, index: number) => boolean) => number;
    contains: (element: T, comparer?: (a: T, b: T) => boolean) => boolean;
    first: (condition?: (item: T, index: number) => boolean) => T;
    firstOreDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    single: (condition?: (item: T, index: number) => boolean) => T;
    singleOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    last: (condition?: (item: T, index: number) => boolean) => T;
    lastOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    skip: (count: number) => Q<T>;
    take: (count: number) => Q<T>;
    reverse: () => Q<T>;
    distinct: (stringifier?: (item: T) => string) => Q<T>;
    except: (other: Iterable<T>, stringifier?: (item: T) => string) => Q<T>;
    intersect: (other: Iterable<T>, stringifier?: (item: T) => string) => Q<T>;
    union: (other: Iterable<T>, stringifier?: (item: T) => string) => Q<T>;
    groupBy: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Q<KeyValue<TKey, TValue[]>>;
    groupComparedBy: <TKey, TValue = T>(keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) => Q<KeyValue<TKey, TValue[]>>;
}

interface B<T, TCollection extends Iterable<T>> extends Iterable<TCollection> {
    flatMap: <R>(selector: (item: IterableItem<TCollection>, index: number) => R) => Q<R>;
}

type Q<T> = T extends Iterable<infer R> ? A<T> & B<R, T> : A<T>;

function create<T>(source: Iterable<T>): Q<T> {
}


interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): ChainIterable<S>

    (condition: (item: T, index: number) => boolean): ChainIterable<T>
}

export class ChainIterable<T> implements Iterable<T> {
    constructor(private readonly source: Iterable<T>) {
    }

    [Symbol.iterator](): Iterator<T> {
        return this.source[Symbol.iterator]();
    }

    toArray = (): T[] => {
        return Array.from(this.source);
    };

    toObject = <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue): Record<TKey, TValue> => {
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
    };

    toMap = <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue): Map<TKey, TValue> => {
        valueSelector = valueSelector || selfSelector;
        const map: Map<TKey, TValue> = new Map();
        for (const item of this.source) {
            const key = keySelector(item);
            if (map.has(key)) {
                throw new Error("Duplicate key: " + key);
            }
            map.set(key, valueSelector(item));
        }
        return map;
    };

    toSet = (): Set<T> => {
        return new Set(this.source);
    };

    map = <R>(selector: (item: T, index: number) => R): ChainIterable<R> => {
        return chain.map(this.source, selector);
    };

    filter: FilterOverride<T> = (condition: (item: T, index: number) => boolean) => {
        return chain.filter(this.source, condition);
    };

    some = (condition?: (item: T, index: number) => boolean): boolean => {
        return chain.some(this.source, condition);
    };

    every = (condition?: (item: T, index: number) => boolean): boolean => {
        return chain.every(this.source, condition);
    };

    append = (element: T): ChainIterable<T> => {
        return chain.append(this.source, element);
    };

    prepend = (element: T): ChainIterable<T> => {
        return chain.prepend(this.source, element);
    };

    concat = <S>(other: Iterable<S>): ChainIterable<T | S> => {
        return chain.concat(this.source, other);
    };

    count = (condition?: (item: T, index: number) => boolean): number => {
        return chain.count(this.source, condition);
    };

    contains = (element: T, comparer?: (a: T, b: T) => boolean): boolean => {
        return chain.contains(this.source, element, comparer);
    };

    first = (condition?: (item: T, index: number) => boolean): T => {
        return chain.first(this.source, condition);
    };

    firstOreDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.firstOrDefault(this.source, defaultValue, condition);
    };

    single = (condition?: (item: T, index: number) => boolean): T => {
        return chain.single(this.source, condition);
    };

    singleOrDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.singleOrDefault(this.source, defaultValue, condition);
    };

    last = (condition?: (item: T, index: number) => boolean): T => {
        return chain.last(this.source, condition);
    };

    lastOrDefault = (defaultValue: T, condition?: (item: T, index: number) => boolean): T => {
        return chain.lastOrDefault(this.source, defaultValue, condition);
    };

    skip = (count: number): ChainIterable<T> => {
        return chain.skip(this.source, count);
    };

    take = (count: number): ChainIterable<T> => {
        return chain.take(this.source, count);
    };

    reverse = (): ChainIterable<T> => {
        return chain.reverse(this.source);
    };

    distinct = (stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.distinct(this.source, stringifier);
    };

    except = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.except(this.source, other, stringifier);
    };

    intersect = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.intersect(this.source, other, stringifier);
    };

    union = (other: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> => {
        return chain.union(this.source, other, stringifier);
    };

    groupBy = <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => {
        return chain.groupBy(this.source, keySelector, valueSelector);
    };

    groupComparedBy = <TKey, TValue = T>(keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) => {
        return chain.groupComparedBy(this.source, keySelector, keyComparer, valueSelector);
    };
}

export class CollectionChainIterable<T, TCollection extends Iterable<T>> {
    constructor(private source: Iterable<TCollection>) {
    }

    flatMap = <R>(selector: (item: IterableItem<TCollection>, index: number) => R): ChainIterable<R> => {
        return chain.flatMap(this.source, selector);
    }
}