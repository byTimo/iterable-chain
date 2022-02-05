import { IterableChain, create, fromGeneratorFunction } from "./iterableChain";
import {
    appendGenerator,
    concatGenerator,
    distinctGenerator,
    exceptGenerator,
    filterGenerator,
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
    objectGenerator,
    zipGenerator,
    joinGenerator
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
    sum,
    groupBy,
    sort
} from "./functions";
import { isIterable, KeyValue, IterableObject, Keyable } from "./common";

export interface Chain {
    <T>(source: Iterable<T>): IterableChain<T>;

    <TValue = unknown, TKey extends Keyable = Keyable>(source: IterableObject<TValue, TKey>): IterableChain<KeyValue<TKey, TValue>>;

    range: (start: number, count: number) => IterableChain<number>;
    repeat: <T>(value: T, count: number) => IterableChain<T>;
    map: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) => IterableChain<R>;
    filter: typeof filter;
    append: <T>(source: Iterable<T>, element: T) => IterableChain<T>;
    prepend: <T>(source: Iterable<T>, element: T) => IterableChain<T>;
    concat: <T, S>(source: Iterable<T>, other: Iterable<S>) => IterableChain<T | S>;
    skip: <T>(source: Iterable<T>, count: number) => IterableChain<T>;
    take: <T>(source: Iterable<T>, count: number) => IterableChain<T>;
    reverse: <T>(source: Iterable<T>) => IterableChain<T>;
    distinct: <T>(source: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    except: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    intersect: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    union: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;
    groupBy: <T, TKey, TValue = T>(
        source: Iterable<T>,
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue,
        keyStringifier?: (key: TKey) => Keyable,
    ) => IterableChain<KeyValue<TKey, TValue[]>>;
    flatMap: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => Iterable<R>) => IterableChain<R>;
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

export const chain: Chain = (function() {
    const func: any = function(source: any) {
        if (isIterable(source)) {
            return create(source);
        }
        return fromGeneratorFunction(objectGenerator, source);
    };

    func.range = function(start: number, count: number): IterableChain<number> {
        return fromGeneratorFunction(rangeGenerator, start, count);
    };
    func.repeat = function <T>(value: T, count: number): IterableChain<T> {
        return fromGeneratorFunction(repeatGenerator, value, count);
    };
    func.map = function <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
        return fromGeneratorFunction(mapGenerator, source, selector);
    };
    func.filter = filter;
    func.append = function <T>(source: Iterable<T>, element: T) {
        return fromGeneratorFunction(appendGenerator, source, element);
    };
    func.prepend = function <T>(source: Iterable<T>, element: T) {
        return fromGeneratorFunction(prependGenerator, source, element);
    };
    func.concat = function <T, S>(source: Iterable<T>, other: Iterable<S>) {
        return fromGeneratorFunction(concatGenerator, source, other);
    };
    func.skip = function <T>(source: Iterable<T>, count: number): IterableChain<T> {
        return fromGeneratorFunction(skipGenerator, source, count);
    };
    func.take = function <T>(source: Iterable<T>, count: number): IterableChain<T> {
        return fromGeneratorFunction(takeGenerator, source, count);
    };
    func.reverse = function <T>(source: Iterable<T>): IterableChain<T> {
        return fromGeneratorFunction(reverseGenerator, source);
    };
    func.distinct = function <T>(source: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
        return fromGeneratorFunction(distinctGenerator, source, stringifier);
    };
    func.except =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(exceptGenerator, first, second, stringifier);
        };
    func.intersect =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(intersectGenerator, first, second, stringifier);
        };
    func.union =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(unionGenerator, first, second, stringifier);
        };
    func.groupBy =
        function <T, TKey, TValue = T>(
            source: Iterable<T>,
            keySelector: (item: T) => TKey,
            valueSelector?: (item: T) => TValue,
            keyStringifier?: (key: TKey) => Keyable
        ) {
            return create(groupBy(source, keySelector, valueSelector, keyStringifier));
        };
    func.flatMap =
        function <T, R>(source: Iterable<T>, selector: (item: T, index: number) => Iterable<R>): IterableChain<R> {
            return fromGeneratorFunction(flatMapGenerator, source, selector);
        };
    func.zip =
        function <T1, T2, R = [T1, T2]>(
            source1: Iterable<T1>,
            source2: Iterable<T2>,
            selector?: (item1: T1, item2: T2) => R
        ): IterableChain<R> {
            return fromGeneratorFunction(zipGenerator, source1, source2, selector);
        };
    func.join =
        function <T1, T2, TKey extends Keyable, R>(
            source1: Iterable<T1>,
            source2: Iterable<T2>,
            source1KeyProvider: (item: T1) => TKey,
            source2KeyProvider: (item: T2) => TKey,
            selector: (item1: T1, item2: T2) => R
        ): IterableChain<R> {
            return fromGeneratorFunction(
                joinGenerator,
                source1,
                source2,
                source1KeyProvider,
                source2KeyProvider,
                selector
            );
        };
    func.sort = function <T>(source: Iterable<T>, comparer?: (a: T, b: T) => number) {
        return create(sort(source, comparer));
    };
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

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): IterableChain<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): IterableChain<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return fromGeneratorFunction(filterGenerator, source, condition);
}
