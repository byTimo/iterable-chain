const key = Symbol("chain_key");
const marker: any = { [key]: true };

export const chain = (function () {
    const create = function <T>(source: Iterable<T>) {
        return new ChainIterable(source);
    }
    create.range = function (start: number, count: number) {
        return new ChainIterable(rangeGenerator(start, count));
    };
    create.repate = function <T>(value: T, count: number) {
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
}

function* rangeGenerator(start: number, count: number) {
    for (let i = 0; i < count; i++) {
        yield start + i;
    }
}

function* repeatGenerator<T>(value: T, count: number) {
    for (let i = 0; i < count; i++) {
        yield value;
    }
}

function* mapGenerator<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
    let i = 0;
    for (const item of source) {
        yield selector(item, i);
        i++;
    }
}

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): ChainIterable<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): ChainIterable<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return new ChainIterable(filterGenerator(source, condition));
}

function* filterGenerator<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            yield item;
        }
    }
}

function some<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): boolean {
    let i = 0;
    condition = condition || (x => !!x);
    for (const item of source) {
        if (condition(item, i)) {
            return true;
        }
    }
    return false;
}

function every<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): boolean {
    let i = 0;
    condition = condition || (x => !!x);
    for (const item of source) {
        if (!condition(item, i)) {
            return false;
        }
    }
    return true;
}

function* appendGenerator<T>(source: Iterable<T>, element: T) {
    yield element;
    for (const item of source) {
        yield item;
    }
}

function* prependGenerator<T>(source: Iterable<T>, element: T) {
    for (const item of source) {
        yield item;
    }
    yield element;
}

function* concatGenerator<T, S>(source: Iterable<T>, other: Iterable<S>) {
    for (const sourceItem of source) {
        yield sourceItem;
    }
    for (const otherItem of other) {
        yield otherItem;
    }
}

function* skipGenerator<T>(source: Iterable<T>, count: number) {
    const iterator = source[Symbol.iterator]();
    let result = iterator.next();
    while (!result.done && count > 0) {
        count--;
        result = iterator.next();
    }
    while (!result.done) {
        yield result.value;
        result = iterator.next();
    }
}

function* takeGenerator<T>(source: Iterable<T>, count: number) {
    const iterator = source[Symbol.iterator]();
    let result = iterator.next();
    while (!result.done && count > 0) {
        yield result.value;
        count--;
        result = iterator.next();
    }
}

function count<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): number {
    let i = 0;
    let result = 0;
    condition = condition || (x => true);
    for (const item of source) {
        if (condition(item, i)) {
            result++;
        }
        i++;
    }
    return result;
}

function contains<T>(source: Iterable<T>, element: T, comparer?: (a: T, b: T) => boolean): boolean {
    comparer = comparer || ((a, b) => a === b);
    for (const item of source) {
        if (comparer(item, element)) {
            return true;
        }
    }
    return false;
}

function firstOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
    condition = condition || (() => true);
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            return item;
        }
    }
    return defaultValue;
}

function first<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = firstOrDefault(source, marker as any, condition);
    if (result === marker) {
        throw new Error("Collection doesn't contains elements");
    }
    return result;
}

function singleOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
    condition = condition || (() => true);
    let counter = 0, index = 0;
    let result: T;
    for (const item of source) {
        if (condition(item, index)) {
            result = item;
            if (++counter > 1) {
                break;
            }
        }
        index++;
    }

    if (counter === 0) {
        return defaultValue;
    }
    if (counter === 1) {
        return result!;
    }
    throw new Error("TODO");
}

function single<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = singleOrDefault(source, marker, condition);
    if (result === marker) {
        throw new Error("TODO");
    }
    return result;
}

function lastOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
    condition = condition || (() => true);
    let result = defaultValue, i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            result = item;
        }
        i++;
    }
    return result;
}

function last<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = lastOrDefault(source, marker, condition);
    if (result === marker) {
        throw new Error("TODO");
    }
    return result;
}