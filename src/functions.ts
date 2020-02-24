import { defalutConditionByElement, defaultCondition, defaultComparer, marker } from "./common";

export function some<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): boolean {
    let i = 0;
    condition = condition || defalutConditionByElement;
    for (const item of source) {
        if (condition(item, i)) {
            return true;
        }
    }
    return false;
}

export function every<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): boolean {
    let i = 0;
    condition = condition || defalutConditionByElement;
    for (const item of source) {
        if (!condition(item, i)) {
            return false;
        }
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

export function firstOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
    condition = condition || defaultCondition;
    let i = 0;
    for (const item of source) {
        if (condition(item, i)) {
            return item;
        }
    }
    return defaultValue;
}

export function first<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = firstOrDefault(source, marker as any, condition);
    if (result === marker) {
        throw new Error("Collection doesn't contains elements");
    }
    return result;
}

export function singleOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
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
    throw new Error("TODO");
}

export function single<T>(source: Iterable<T>, condition?: (item: T, index: number) => boolean): T {
    const result = singleOrDefault(source, marker, condition);
    if (result === marker) {
        throw new Error("TODO");
    }
    return result;
}

export function lastOrDefault<T>(source: Iterable<T>, defaultValue: T, condition?: (item: T, index: number) => boolean): T {
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
        throw new Error("TODO");
    }
    return result;
}