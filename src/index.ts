import { ChainIterable } from "./chainIterable";
import { rangeGenerator, repeatGenerator, mapGenerator, appendGenerator, prependGenerator, concatGenerator, skipGenerator, takeGenerator, reverseGenerator, filterGenerator } from "./generators";
import { some, every, contains, first, firstOrDefault, single, singleOrDefault, last, lastOrDefault, count } from "./functions";

export const chain = (function () {
    const create = function <T>(source: Iterable<T>) {
        return new ChainIterable(source);
    }
    create.range = function (start: number, count: number): ChainIterable<number> {
        return new ChainIterable(rangeGenerator(start, count));
    };
    create.repate = function <T>(value: T, count: number): ChainIterable<T> {
        return new ChainIterable(repeatGenerator(value, count));
    };
    create.map = function <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
        return new ChainIterable(mapGenerator(source, selector));
    };
    create.filter = filter;
    create.append = function <T>(source: Iterable<T>, element: T) {
        return new ChainIterable(appendGenerator(source, element));
    }
    create.prepend = function <T>(source: Iterable<T>, element: T) {
        return new ChainIterable(prependGenerator(source, element));
    }
    create.concat = function <T, S>(source: Iterable<T>, other: Iterable<S>) {
        return new ChainIterable(concatGenerator(source, other));
    }
    create.skip = function <T>(source: Iterable<T>, count: number): ChainIterable<T> {
        return new ChainIterable(skipGenerator(source, count));
    }
    create.take = function <T>(source: Iterable<T>, count: number): ChainIterable<T> {
        return new ChainIterable(takeGenerator(source, count));
    }
    create.reverse = function <T>(source: Iterable<T>): ChainIterable<T> {
        return new ChainIterable(reverseGenerator(source));
    }
    create.some = some;
    create.every = every;
    create.count = count;
    create.contains = contains;
    create.first = first;
    create.firstOrDefault = firstOrDefault;
    create.single = single;
    create.singleOrDefault = singleOrDefault;
    create.last = last;
    create.lastOrDefault = lastOrDefault;
    return create;
})()

export type Chain = typeof chain;

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): ChainIterable<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): ChainIterable<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return new ChainIterable(filterGenerator(source, condition));
}