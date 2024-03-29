import { KeyValue, selfSelector, Keyable } from "./common";
import { groupBy } from "./functions";

export function* objectGenerator<TValue, TKey extends Keyable, >(obj: Record<TKey, TValue>): Generator<KeyValue<TKey, TValue>> {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            yield [key, obj[key]];
        }
    }
}

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

export function* mapGenerator<T, R>(source: Iterable<T>, mapper: (item: T, index: number) => R) {
    let i = 0;
    for (const item of source) {
        yield mapper(item, i);
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
    for (const item of source) {
        yield item;
    }
    yield element;
}

export function* prependGenerator<T>(source: Iterable<T>, element: T) {
    yield element;
    for (const item of source) {
        yield item;
    }
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
    stringifier = stringifier || selfSelector;
    const set = new Set<string>();
    for (const item of source) {
        const key = stringifier(item);
        if (!set.has(key)) {
            set.add(key);
            yield item;
        }
    }
}

export function* exceptGenerator<T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) {
    stringifier = stringifier || selfSelector;
    const set = new Set<string>(mapGenerator(second, stringifier));
    for (const item of first) {
        if (!set.has(stringifier(item))) {
            yield item;
        }
    }
}

export function* intersectGenerator<T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) {
    stringifier = stringifier || selfSelector;
    const set = new Set<string>(mapGenerator(second, stringifier));
    for (const item of first) {
        if (set.has(stringifier(item))) {
            yield item;
        }
    }
}

export function unionGenerator<T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) {
    stringifier = stringifier || selfSelector;
    return distinctGenerator(concatGenerator(first, second), stringifier);
}

export function* flatMapGenerator<T, R>(source: Iterable<T>, mapper: (item: T, index: number) => Iterable<R>) {
    let i = 0;
    for (const item of source) {
        const mapped = mapper(item, i);
        for (const selectedItem of mapped) {
            yield selectedItem;
        }
        i++;
    }
}

const defaultZipSelector = <T1, T2>(item1: T1, item2: T2) => [item1, item2] as any;

export function* zipGenerator<T1, T2, R = [T1, T2]>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    selector?: (item1: T1, item2: T2) => R
) {
    selector = selector ?? defaultZipSelector;
    const aIter = source1[Symbol.iterator]();
    const bIter = source2[Symbol.iterator]();

    let source1Next = aIter.next();
    let source2Next = bIter.next();

    while (!source1Next.done && !source2Next.done) {
        yield selector(source1Next.value, source2Next.value);
        source1Next = aIter.next();
        source2Next = bIter.next();
    }
}

export function* joinGenerator<T1, T2, TKey extends Keyable, R>(
    source1: Iterable<T1>,
    source2: Iterable<T2>,
    source1KeyProvider: (item: T1) => TKey,
    source2KeyProvider: (item: T2) => TKey,
    selector: (item1: T1, item2: T2) => R
) {
    const source1ByKey = new Map(groupBy(source1, source1KeyProvider));
    for (const item2 of source2) {
        const key = source2KeyProvider(item2);
        if (!source1ByKey.has(key)) {
            continue;
        }

        const items1 = source1ByKey.get(key)!;
        for (const item1 of items1) {
            yield selector(item1, item2);
        }
    }
}
