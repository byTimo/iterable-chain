export const chain = (function () {
    const create = function <T>(source: Iterable<T>) {
        return new ChainIterable(source);
    }
    create.range = range;
    create.repate = repeat;
    create.map = map;
    create.filter = filter;
    return create;
})()

export type Chain = typeof chain;

class ChainIterable<T> {
    constructor(private readonly source: Iterable<T>) {
    }

    get iterable() {
        return this.source;
    }

    map = <R>(selector: (item: T, index: number) => R): ChainIterable<R> => {
        return map(this.source, selector);
    }

    get array(): T[] {
        return Array.from(this.source);
    }
}

function range(start: number, count: number) {
    return new ChainIterable(rangeGenerator(start, count));
}

function* rangeGenerator(start: number, count: number) {
    for (let i = 0; i < count; i++) {
        yield start + i;
    }
}

function repeat<T>(value: T, count: number) {
    return new ChainIterable(repeatGenerator(value, count));
}

function* repeatGenerator<T>(value: T, count: number) {
    for (let i = 0; i < count; i++) {
        yield value;
    }
}


function map<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
    return new ChainIterable(mapGenerator(source, selector));
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