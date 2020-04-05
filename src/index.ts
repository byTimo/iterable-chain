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
    flatMapGenerator
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
    reduce
} from "./functions";

export const chain = (function () {
    const func = function <T>(source: Iterable<T>) {
        return create(source);
    };
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
    return func;
})();

export type Chain = typeof chain;

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): ChainIterable<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): ChainIterable<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return create(filterGenerator(source, condition));
}
