export const chain = (function () {
    const create = function <T>(source: Iterable<T>) {
        return new ChainIterator(source);
    }
    create.map = map;
    create.filter = filter;
    return create;
})()

export type Chain = typeof chain;

class ChainIterator<T> {
    constructor(private readonly source: Iterable<T>) {
    }

    map = <R>(selector: (item: T, index: number) => R): ChainIterator<R> => {
        return map(this.source, selector);
    }

    toArray = (): T[] => {
        return Array.from(this.source);
    }
}


function map<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
    return new ChainIterator(mapGenerator(source, selector));
}

function* mapGenerator<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
    let i = 0;
    for (const item of source) {
        yield selector(item, i);
        i++;
    }
}

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): ChainIterator<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): ChainIterator<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return new ChainIterator(filterGenerator(source, condition));
}

function* filterGenerator<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            yield item;
        }
    }
}