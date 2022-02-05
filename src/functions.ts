import {
    defaultComparer,
    defaultCondition,
    defaultConditionByElement,
    marker,
    selfSelector,
    Keyable,
    KeyValue, selfToStringStringifier
} from "./common";

const noItemsByConditionErrorMessage = "There are no items in the collection by the specified condition";

export function toObject<T, TKey extends Keyable, TValue = T>(
    source: Iterable<T>,
    keySelector: (item: T) => TKey,
    valueSelector?: (item: T) => TValue
): Record<TKey, TValue> {
    valueSelector = valueSelector || selfSelector;
    const result: Record<TKey, TValue> = {} as any;
    for (const item of source) {
        const key = keySelector(item);
        if (key in result) {
            throw new Error("Duplicate key: " + key);
        }
        result[key] = valueSelector(item);
    }
    return result;
}

export function toMap<T, TKey extends Keyable, TValue = T>(
    source: Iterable<T>,
    keySelector: (item: T) => TKey,
    valueSelector?: (item: T) => TValue
): Map<TKey, TValue> {
    valueSelector = valueSelector || selfSelector;
    const map: Map<TKey, TValue> = new Map();
    for (const item of source) {
        const key = keySelector(item);
        if (map.has(key)) {
            throw new Error("Duplicate key: " + key);
        }
        map.set(key, valueSelector(item));
    }
    return map;
}

export function some<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): boolean {
    let i = 0;
    condition = condition || defaultConditionByElement;
    for (const item of source) {
        if (condition(item, i)) {
            return true;
        }
        i++;
    }
    return false;
}

export function every<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): boolean {
    let i = 0;
    for (const item of source) {
        if (!condition(item, i)) {
            return false;
        }
        i++;
    }
    return true;
}

export function count<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): number {
    let i = 0;
    let result = 0;
    condition = condition || defaultCondition;
    for (const item of source) {
        if (condition(item, i)) {
            result++;
        }
        i++;
    }
    return result;
}

export function contains<T>(source: Iterable<T>, element: T, comparer?: (a: T, b: T) => boolean): boolean {
    comparer = comparer || defaultComparer;
    for (const item of source) {
        if (comparer(item, element)) {
            return true;
        }
    }
    return false;
}

export function firstOrDefault<T>(
    source: Iterable<T>,
    defaultValue: T,
    condition?: (item: T, index: number) => boolean
): T {
    condition = condition || defaultCondition;
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            return item;
        }
        i++;
    }
    return defaultValue;
}

export function first<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = firstOrDefault(source, marker as any, condition);
    if (result === marker) {
        throw new Error(noItemsByConditionErrorMessage);
    }
    return result;
}

export function singleOrDefault<T>(
    source: Iterable<T>,
    defaultValue: T,
    condition?: (item: T, index: number) => boolean
): T {
    condition = condition || defaultCondition;
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
    throw new Error("There is more then one item in the collection by the specified condition");
}

export function single<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = singleOrDefault(source, marker, condition);
    if (result === marker) {
        throw new Error(noItemsByConditionErrorMessage);
    }
    return result;
}

export function lastOrDefault<T>(
    source: Iterable<T>,
    defaultValue: T,
    condition?: (item: T, index: number) => boolean
): T {
    condition = condition || defaultCondition;
    let result = defaultValue, i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            result = item;
        }
        i++;
    }
    return result;
}

export function last<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = lastOrDefault(source, marker, condition);
    if (result === marker) {
        throw new Error(noItemsByConditionErrorMessage);
    }
    return result;
}

export function reduce<T, U = T>(source: Iterable<T>, callback: (prev: U, cur: T, index: number) => U, initial?: U): U {
    const iterator = source[Symbol.iterator]();
    let index = 0;
    let result: U = initial!;
    let next = iterator.next();
    if (arguments.length === 2) {
        if (next.done) {
            throw new Error("Can't reduce an empty collection without specifying the initial value of the accumulator");
        }
        result = next.value as any as U;
        index++;
        next = iterator.next();
    }
    while (!next.done) {
        result = callback(result, next.value, index);
        index++;
        next = iterator.next();
    }
    return result;
}

export function groupBy<T, TKey, TValue = T>(
    source: Iterable<T>,
    keySelector: (item: T) => TKey,
    valueSelector?: (item: T) => TValue,
    keyStringifier?: (item: TKey) => Keyable,
): Array<KeyValue<TKey, TValue[]>> {
    valueSelector = valueSelector || selfSelector;
    keyStringifier = keyStringifier || selfToStringStringifier;
    const indexMap: Record<Keyable, number> = {} as any;
    const result: Array<KeyValue<TKey, TValue[]>> = [];
    for (const item of source) {
        const key = keySelector(item);
        const indexKey = keyStringifier(key);
        if (indexMap[indexKey] == null) {
            indexMap[indexKey] = result.push([key, []]) - 1;
        }
        const [, values] = result[indexMap[indexKey]]
        values.push(valueSelector(item))
    }
    return result;
}

export function sort<T>(source: Iterable<T>, comparer?: (a: T, b: T) => number) {
    const buffer = Array.from(source);
    buffer.sort(comparer);
    return buffer;
}


export function min(source: Iterable<number>): number {
    return Math.min(...source);
}

export function max(source: Iterable<number>): number {
    return Math.max(...source);
}

export function sum(source: Iterable<number>): number {
    return reduce(source, (p, c) => p + c, 0);
}
