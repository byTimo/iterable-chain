export function* rangeGenerator(start: number, count: number) {
    for (let i = 0; i < count; i++) {
        yield start + i;
    }
}

export function* repeatGenerator<T>(value: T, count: number) {
    for (let i = 0; i < count; i++) {
        yield value;
    }
}

export function* mapGenerator<T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) {
    let i = 0;
    for (const item of source) {
        yield selector(item, i);
        i++;
    }
}

export function* filterGenerator<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            yield item;
        }
    }
}

export function* appendGenerator<T>(source: Iterable<T>, element: T) {
    yield element;
    for (const item of source) {
        yield item;
    }
}

export function* prependGenerator<T>(source: Iterable<T>, element: T) {
    for (const item of source) {
        yield item;
    }
    yield element;
}

export function* concatGenerator<T, S>(source: Iterable<T>, other: Iterable<S>) {
    for (const sourceItem of source) {
        yield sourceItem;
    }
    for (const otherItem of other) {
        yield otherItem;
    }
}

export function* skipGenerator<T>(source: Iterable<T>, count: number) {
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

export function* takeGenerator<T>(source: Iterable<T>, count: number) {
    const iterator = source[Symbol.iterator]();
    let result = iterator.next();
    while (!result.done && count > 0) {
        yield result.value;
        count--;
        result = iterator.next();
    }
}

export function* reverseGenerator<T>(source: Iterable<T>) {
    const buffer = Array.from(source);
    for (let i = 0; i < buffer.length; i++) {
        yield buffer[buffer.length - i - 1];
    }
}

export function* distinctGenerator<T>(source: Iterable<T>, stringifier?: (item: T) => string) {
    stringifier = stringifier || (x => x as any);
    const set = new Set<string>();
    for (const item of source) {
        const key = stringifier(item)
        if (!set.has(key)) {
            set.add(key);
            yield item
        }
    }
}