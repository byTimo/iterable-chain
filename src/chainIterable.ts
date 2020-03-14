import { IterableItem, KeyValue } from "./common";
import { mapGenerator, filterGenerator, appendGenerator, concatGenerator, prependGenerator, skipGenerator, takeGenerator, distinctGenerator, exceptGenerator, intersectGenerator, unionGenerator, groupByGenerator, groupComparedByGenerator, reverseGenerator, flatMapGenerator } from "./generators";
import { contains, count, some, every, first, firstOrDefault, single, singleOrDefault, last, lastOrDefault, toObject, toMap } from "./functions";

export interface ChainIterable<T> extends Iterable<T> {
    toArray: () => T[];
    toObject: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Record<TKey, TValue>;
    toMap: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Map<TKey, TValue>;
    toSet: () => Set<T>;
    map: <R>(selector: (item: T, index: number) => R) => ChainIterable<R>;
    filter: FilterOverride<T>;
    some: (condition?: (item: T, index: number) => boolean) => boolean;
    every: (condition?: (item: T, index: number) => boolean) => boolean;
    append: (element: T) => ChainIterable<T>;
    prepend: (element: T) => ChainIterable<T>;
    concat: <S>(other: Iterable<S>) => ChainIterable<T | S>;
    count: (condition?: (item: T, index: number) => boolean) => number;
    contains: (element: T, comparer?: (a: T, b: T) => boolean) => boolean;
    first: (condition?: (item: T, index: number) => boolean) => T;
    firstOreDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    single: (condition?: (item: T, index: number) => boolean) => T;
    singleOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    last: (condition?: (item: T, index: number) => boolean) => T;
    lastOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;
    skip: (count: number) => ChainIterable<T>;
    take: (count: number) => ChainIterable<T>;
    reverse: () => ChainIterable<T>;
    distinct: (stringifier?: (item: T) => string) => ChainIterable<T>;
    except: (other: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    intersect: (other: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    union: (other: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    groupBy: <TKey extends string | number | symbol, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => ChainIterable<KeyValue<TKey, TValue[]>>;
    groupComparedBy: <TKey, TValue = T>(keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) => ChainIterable<KeyValue<TKey, TValue[]>>;
    flatMap: T extends Iterable<infer R> ? <X>(selector: (item: R, index: number) => X) => ChainIterable<X> : never;
}

interface CollectionChainIterable<T> extends Iterable<T> {
    flatMap: <R>(selector: (item: T, index: number) => R) => ChainIterable<R>;
}

interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): ChainIterable<S>

    (condition: (item: T, index: number) => boolean): ChainIterable<T>
}

export function create<T>(source: Iterable<T>): ChainIterable<T> {
    const iter: Omit<ChainIterable<T>, keyof CollectionChainIterable<T>> & CollectionChainIterable<T> = {
        map: (selector) => create(mapGenerator(source, selector)),
        filter: (condition: any) => create(filterGenerator(source, condition)),
        append: (element) => create(appendGenerator(source, element)),
        prepend: (element) => create(prependGenerator(source, element)),
        concat: (other) => create(concatGenerator(source, other)),
        skip: (count) => create(skipGenerator(source, count)),
        take: (count) => create(takeGenerator(source, count)),
        reverse: () => create(reverseGenerator(source)),
        distinct: (stringifier) => create(distinctGenerator(source, stringifier)),
        except: (other, stringifier) => create(exceptGenerator(source, other, stringifier)),
        intersect: (other, stringifier) => create(intersectGenerator(source, other, stringifier)),
        union: (other, stringifier) => create(unionGenerator(source, other, stringifier)),
        groupBy: (keySelector, valueSelector) => create(groupByGenerator(source, keySelector, valueSelector)),
        groupComparedBy: (keySelector, keyComparer, valueSelector) => create(groupComparedByGenerator(source, keySelector, keyComparer, valueSelector)),
        contains: (element, comparer) => contains(source, element, comparer),
        count: (condition) => count(source, condition),
        every: (condition) => every(source, condition),
        some: (condition) => some(source, condition),
        first: (condtion) => first(source, condtion),
        firstOreDefault: (defaultValue, condtion) => firstOrDefault(source, defaultValue, condtion),
        single: (condtion) => single(source, condtion),
        singleOrDefault: (defaultValue, condtion) => singleOrDefault(source, defaultValue, condtion),
        last: (condition) => last(source, condition),
        lastOrDefault: (defaultValue, condition) => lastOrDefault(source, defaultValue, condition),
        toArray: () => Array.from(source),
        toSet: () => new Set(source),
        toObject: (keySelector, valueSelector) => toObject(source, keySelector, valueSelector),
        toMap: (keySelector, valueSelector) => toMap(source, keySelector, valueSelector),
        flatMap: (selector) => create(flatMapGenerator(source as any as Iterable<Iterable<T>>, selector)),
        [Symbol.iterator]: () => source[Symbol.iterator]()
    };

    return iter as ChainIterable<T>;
}

