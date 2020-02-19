export const chain = (function () {
    const create = function <T>(source: Iterable<T>) {
        return new ChainIterable(source);
    }
    create.range = function (start: number, count: number) {
        return new ChainIterable(rangeGenerator(start, count));
    };
    create.repate = function repeat<T>(value: T, count: number) {
        return new ChainIterable(repeatGenerator(value, count));
    };
    create.map = function map<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
        return new ChainIterable(mapGenerator(source, selector));
    };
    create.filter = filter;
    create.some = some;
    create.every = every;
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