import { ChainIterable, create } from "./chainIterable";
import {
    appendGenerator,
    concatGenerator,
    distinctGenerator,
    exceptGenerator,
    filterGenerator,
    groupByGenerator,
    groupComparedByGenerator,
    intersectGenerator,
    mapGenerator,
    prependGenerator,
    rangeGenerator,
    repeatGenerator,
    reverseGenerator,
    skipGenerator,
    takeGenerator,
    unionGenerator,
    flatMapGenerator,
    objectGenerator
} from "./generators";
import {
    contains,
    count,
    every,
    first,
    firstOrDefault,
    last,
    lastOrDefault,
    single,
    singleOrDefault,
    some,
    reduce,
    min,
    max,
    sum
} from "./functions";
import { isIterable, KeyValue } from "./common";

export interface Chain {
    <T>(source: Iterable<T>): ChainIterable<T>;
    <TKey extends string | number | symbol, TValue>(source: Record<TKey, TValue>): ChainIterable<KeyValue<TKey, TValue>>;
    range: (start: number, count: number) => ChainIterable<number>;
    repeat: <T>(value: T, count: number) => ChainIterable<T>
    map: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) => ChainIterable<R>;
    filter: typeof filter;
    append: <T>(source: Iterable<T>, element: T) => ChainIterable<T>;
    prepend: <T>(source: Iterable<T>, element: T) => ChainIterable<T>;
    concat: <T, S>(source: Iterable<T>, other: Iterable<S>) => ChainIterable<T | S>;
    skip: <T>(source: Iterable<T>, count: number) => ChainIterable<T>;
    take: <T>(source: Iterable<T>, count: number) => ChainIterable<T>;
    reverse: <T>(source: Iterable<T>) => ChainIterable<T>;
    distinct: <T>(source: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    except: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    intersect: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    union: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => ChainIterable<T>;
    groupBy: <T, TKey extends string | number | symbol, TValue = T>(source: Iterable<T>, keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => ChainIterable<KeyValue<TKey, TValue[]>>;
    groupComparedBy: <T, TKey, TValue = T>(source: Iterable<T>, keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) => ChainIterable<KeyValue<TKey, TValue[]>>;
    flatMap: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => Iterable<R>) => ChainIterable<R>;
    some: typeof some;
    every: typeof every;
    count: typeof count;
    contains: typeof contains;
    first: typeof first;
    firstOrDefault: typeof firstOrDefault;
    single: typeof single;
    singleOrDefault: typeof singleOrDefault;
    last: typeof last;
    lastOrDefault: typeof lastOrDefault;
    reduce: typeof reduce;
    min: typeof min;
    max: typeof max;
    sum: typeof sum;
}

export const chain: Chain = (function () {
    const func: any = function (source: any) {
        if (isIterable(source)) {
            return create(source);
        }
        return create(objectGenerator(source));
    }

    func.range = function (start: number, count: number): ChainIterable<number> {
        return create(rangeGenerator(start, count));
    };
    func.repeat = function <T>(value: T, count: number): ChainIterable<T> {
        return create(repeatGenerator(value, count));
    };
    func.map = function <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
        return create(mapGenerator(source, selector));
    };
    func.filter = filter;
    func.append = function <T>(source: Iterable<T>, element: T) {
        return create(appendGenerator(source, element));
    };
    func.prepend = function <T>(source: Iterable<T>, element: T) {
        return create(prependGenerator(source, element));
    };
    func.concat = function <T, S>(source: Iterable<T>, other: Iterable<S>) {
        return create(concatGenerator(source, other));
    };
    func.skip = function <T>(source: Iterable<T>, count: number): ChainIterable<T> {
        return create(skipGenerator(source, count));
    };
    func.take = function <T>(source: Iterable<T>, count: number): ChainIterable<T> {
        return create(takeGenerator(source, count));
    };
    func.reverse = function <T>(source: Iterable<T>): ChainIterable<T> {
        return create(reverseGenerator(source));
    };
    func.distinct = function <T>(source: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> {
        return create(distinctGenerator(source, stringifier));
    };
    func.except = function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> {
        return create(exceptGenerator(first, second, stringifier));
    };
    func.intersect = function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> {
        return create(intersectGenerator(first, second, stringifier));
    };
    func.union = function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): ChainIterable<T> {
        return create(unionGenerator(first, second, stringifier));
    };
    func.groupBy = function <T, TKey extends string | number | symbol, TValue = T>(source: Iterable<T>, keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) {
        return create(groupByGenerator(source, keySelector, valueSelector));
    };
    func.groupComparedBy = function <T, TKey, TValue = T>(source: Iterable<T>, keySelector: (item: T) => TKey, keyComparer?: (a: TKey, b: TKey) => boolean, valueSelector?: (item: T) => TValue) {
        return create(groupComparedByGenerator(source, keySelector, keyComparer, valueSelector));
    };
    func.flatMap = function <T, R>(source: Iterable<T>, selector: (item: T, index: number) => Iterable<R>): ChainIterable<R> {
        return create(flatMapGenerator(source, selector));
    }
    func.some = some;
    func.every = every;
    func.count = count;
    func.contains = contains;
    func.first = first;
    func.firstOrDefault = firstOrDefault;
    func.single = single;
    func.singleOrDefault = singleOrDefault;
    func.last = last;
    func.lastOrDefault = lastOrDefault;
    func.reduce = reduce;
    func.min = min;
    func.max = max;
    func.sum = sum;
    return func;
})();

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): ChainIterable<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): ChainIterable<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return create(filterGenerator(source, condition));
}
