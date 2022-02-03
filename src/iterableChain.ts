import { KeyValue, Keyable, chainMarker } from "./common";
import {
    mapGenerator,
    filterGenerator,
    appendGenerator,
    concatGenerator,
    prependGenerator,
    skipGenerator,
    takeGenerator,
    distinctGenerator,
    exceptGenerator,
    intersectGenerator,
    unionGenerator,
    reverseGenerator,
    flatMapGenerator,
    zipGenerator
} from "./generators";
import {
    contains,
    count,
    some,
    every,
    first,
    firstOrDefault,
    single,
    singleOrDefault,
    last,
    lastOrDefault,
    toObject,
    toMap,
    reduce,
    max,
    min,
    sum,
    groupByGenerator
} from "./functions";

export interface IterableChain<T> extends Iterable<T> {
    toArray: () => T[];
    toObject: <TKey extends string | number | symbol, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue
    ) => Record<TKey, TValue>;
    toMap: <TKey extends string | number | symbol, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue
    ) => Map<TKey, TValue>;
    toSet: () => Set<T>;
    map: <R>(selector: (item: T, index: number) => R) => IterableChain<R>;
    filter: FilterOverride<T>;
    some: (condition?: (item: T, index: number) => boolean) => boolean;
    every: (condition: (item: T, index: number) => boolean) => boolean;
    append: (element: T) => IterableChain<T>;
    prepend: (element: T) => IterableChain<T>;
    concat: <S>(other: Iterable<S>) => IterableChain<T | S>;
    count: (condition?: (item: T, index: number) => boolean) => number;
    contains: (element: T, comparer?: (a: T, b: T) => boolean) => boolean;
    first: (condition?: (item: T, index: number) => boolean) => T;
    firstOreDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    single: (condition?: (item: T, index: number) => boolean) => T;
    singleOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    last: (condition?: (item: T, index: number) => boolean) => T;
    lastOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    skip: (count: number) => IterableChain<T>;
    take: (count: number) => IterableChain<T>;
    reverse: () => IterableChain<T>;
    distinct: (stringifier?: (item: T) => string) => IterableChain<T>;
    except: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    intersect: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    union: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    groupBy: <TKey, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue,
        keyStringifier?: (key: TKey) => Keyable
    ) => IterableChain<KeyValue<TKey, TValue[]>>;
    flatMap: <R>(selector: (item: T, index: number) => Iterable<R>) => IterableChain<R>;
    zip: <T2, R = [T, T2]>(other: Iterable<T2>, selector?: (item1: T, item2: T2) => R) => IterableChain<R>;
    reduce: <U = T>(callback: (prev: U, cur: T, index: number) => U, initial?: U) => U;
    min: T extends number ? () => number : never;
    max: T extends number ? () => number : never;
    sum: T extends number ? () => number : never;
    [chainMarker]: true;
}

interface NumberChainIterable {
    min: () => number;
    max: () => number;
    sum: () => number;
}

interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): IterableChain<S>;

    (condition: (item: T, index: number) => boolean): IterableChain<T>;
}

export function create<T>(source: Iterable<T>): IterableChain<T> {
    const iter: Omit<IterableChain<T>, keyof NumberChainIterable> & NumberChainIterable & Iterable<T> = {
        map: (selector) => fromGeneratorFunction(mapGenerator, source, selector,),
        filter: (condition: any) => fromGeneratorFunction(filterGenerator, source, condition),
        append: (element) => fromGeneratorFunction(appendGenerator, source, element),
        prepend: (element) => fromGeneratorFunction(prependGenerator, source, element),
        concat: (other) => fromGeneratorFunction(concatGenerator, source, other),
        skip: (count) => fromGeneratorFunction(skipGenerator, source, count),
        take: (count) => fromGeneratorFunction(takeGenerator, source, count),
        reverse: () => fromGeneratorFunction(reverseGenerator, source),
        distinct: (stringifier) => fromGeneratorFunction(distinctGenerator, source, stringifier),
        except: (other, stringifier) => fromGeneratorFunction(exceptGenerator, source, other, stringifier),
        intersect: (other, stringifier) => fromGeneratorFunction(intersectGenerator, source, other, stringifier),
        union: (other, stringifier) => fromGeneratorFunction(unionGenerator, source, other, stringifier),
        groupBy: (keySelector, valueSelector, keyStringifier) => create(
            groupByGenerator(
                source,
                keySelector,
                valueSelector,
                keyStringifier
            )),
        flatMap: (selector) => fromGeneratorFunction(flatMapGenerator, source, selector),
        zip: (other, selector) => fromGeneratorFunction(zipGenerator, source, other, selector),
        contains: (element, comparer) => contains(source, element, comparer),
        count: (condition) => count(source, condition),
        every: (condition) => every(source, condition),
        some: (condition) => some(source, condition),
        first: (condition) => first(source, condition),
        firstOreDefault: (defaultValue, condition) => firstOrDefault(source, defaultValue, condition),
        single: (condition) => single(source, condition),
        singleOrDefault: (defaultValue, condition) => singleOrDefault(source, defaultValue, condition),
        last: (condition) => last(source, condition),
        lastOrDefault: (defaultValue, condition) => lastOrDefault(source, defaultValue, condition),
        toArray: () => Array.isArray(source) ? source : Array.from(source),
        toSet: () => new Set(source),
        toObject: (keySelector, valueSelector) => toObject(source, keySelector, valueSelector),
        toMap: (keySelector, valueSelector) => toMap(source, keySelector, valueSelector),
        reduce: function(callback, initial) {
            return arguments.length === 1
                ? reduce(source, callback)
                : reduce(source, callback, initial);
        },
        max: () => max(source as any),
        min: () => min(source as any),
        sum: () => sum(source as any),
        [Symbol.iterator]: () => source[Symbol.iterator](),
        [chainMarker]: true,
    };

    return iter as IterableChain<T>;
}

export function fromGeneratorFunction<Args extends unknown[], R>(
    generatorFunction: (...args: Args) => Generator<R>,
    ...args: Args
): IterableChain<R> {
    return create({ [Symbol.iterator]: () => generatorFunction(...args) });
}
