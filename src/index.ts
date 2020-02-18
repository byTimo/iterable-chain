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
    return create;
})()

export type Chain = typeof chain;

interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): ChainIterable<S>
    (condition: (item: T, index: number) => boolean): ChainIterable<T>
}

class ChainIterable<T> {
    constructor(private readonly source: Iterable<T>) {
    }

    get iterable() {
        return this.source;
    }

    map = <R>(selector: (item: T, index: number) => R): ChainIterable<R> => {
        return chain.map(this.source, selector);
    }

    filter: FilterOverride<T> = (condition: (item: T, index: number) => boolean) => {
        return chain.filter(this.source, condition);
    }

    get array(): T[] {
        return Array.from(this.source);
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