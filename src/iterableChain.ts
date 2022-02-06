import { KeyValue, Keyable, chainMarker } from "./common";
import {
    mapGenerator,
    filterGenerator,
    appendGenerator,
    concatGenerator,
    prependGenerator,
    skipGenerator,
    takeGenerator,
    distinctGenerator,
    exceptGenerator,
    intersectGenerator,
    unionGenerator,
    reverseGenerator,
    flatMapGenerator,
    zipGenerator,
    joinGenerator
} from "./generators";
import {
    contains,
    count,
    some,
    every,
    first,
    firstOrDefault,
    single,
    singleOrDefault,
    last,
    lastOrDefault,
    toObject,
    toMap,
    reduce,
    max,
    min,
    sum,
    groupBy,
    sort
} from "./functions";

export interface IterableChain<T> extends Iterable<T> {
    /**
     * Converts the iterable into an array.
     */
    toArray: () => T[];

    /**
     * Converts the iterable into an object. The object is created by keys that provide by the `keySelector` function.
     * By default, the iterable item value is used as the object value, but if `valueSelector` is passed, result of
     * the `valueSelector` is used as the object value.
     * @param keySelector a function that selects the key from the item.
     * @param valueSelector a function that selects the value from the item.
     */
    toObject: <TKey extends Keyable, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue
    ) => Record<TKey, TValue>;

    /**
     * Converts the iterable into a Map. The Map is created by keys that provide by the `keySelector` function.
     * By default, the iterable item value is used as the map value, but if `valueSelector` is passed, result of
     * the `valueSelector` is used as the map value.
     * @param keySelector a function that selects the key from the item.
     * @param valueSelector a function that selects the value from the item.
     */
    toMap: <TKey extends Keyable, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue
    ) => Map<TKey, TValue>;

    /**
     * Converts the iterable into a set
     */
    toSet: () => Set<T>;

    /**
     * Creates a new iterable object that, during iteration,
     * maps each item of the previous iterable object using the passed function.
     * @param mapper a function that maps an item to an item in the next iterable.
     */
    map: <R>(mapper: (item: T, index: number) => R) => IterableChain<R>;

    /**
     * Creates a new iterable object. During the iteration,
     * it leaves only those items for which the condition returns true.
     * @param condition a function that has to returns true for item if this item doesn't need to be skipped.
     */
    filter: FilterOverride<T>;

    /**
     * Creates a new iterable object that iterates all previous values and adds the passed item to the end of the iteration.
     * @param element is added to the end of the iteration.
     */
    append: (element: T) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates all previous values and adds the passed item to the beginning of the iteration.
     * @param element is added to the beginning of the iteration.
     */
    prepend: (element: T) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates over all previous values, and after all the values of the passed Iterable.
     * @param other a Iterable whose values are iterated after the previous values.
     */
    concat: <S>(other: Iterable<S>) => IterableChain<T | S>;

    /**
     * Creates a new iterable object that skips the specified number of the items during the iteration. If the Iterable
     * has fewer item than the skipped number, an empty Iterable is returned.
     * @param count the number of the skipping items.
     */
    skip: (count: number) => IterableChain<T>;

    /**
     * Creates a new iterable object that takes the specified number of the items during the iteration. If the Iterable
     * has fewer item than the taken number, all items of the Iterable is iterated.
     * @param count the number of the taken items.
     */
    take: (count: number) => IterableChain<T>;

    /**
     * Creates a new iterable object that reverses the order of the items.
     */
    reverse: () => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only unique items. The method uses Set inside, so non-primitives values
     * are compared by references. If the stringifier is passed, the method uses its results as a values for comparison.
     * @param stringifier a function that transforms each item of the Iterable to a string. These strings are used for comparison.
     */
    distinct: (stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only those items that are not in `other` Iterable. The method uses
     * Set inside, so non-primitives values are compared by references. If the stringifier is passed, the method uses
     * its results as a values for comparison.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    except: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only those items that are in `other` Iterable. The method uses
     * Set inside, so non-primitives values are compared by references. If the stringifier is passed, the method uses
     * its results as a values for comparison.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    intersect: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates over all previous values, and after only those items of the `other`
     * Iterable that are not in the previous values. The method uses Set inside, so non-primitives values are compared
     * by references. If the stringifier is passed, the method uses its results as a values for comparison.
     * @param other a Iterable whose values are iterated after the previous values.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    union: (other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that groups all items and iterates the groups. The groups are created by keys that
     * provide by the `keySelector` function. Each group may have multiple values, so each group is represented by a
     * tuple `[key, value[]]`. By default, the iterable item value is used as the group value, but if `valueSelector` is
     * passed, result of the `valueSelector` is used as the group value. The method uses {} for grouping inside, so for
     * non-primitives values of keys is used `toString` method. If `keyStringifier` is passed, the method uses its
     * its results for grouping inside, but does not change outgoing keys.
     * @param keySelector a function that selects the key form the item.
     * @param valueSelector a function that selects the value from the item.
     * @param keyStringifier a function that transforms each key of the item to a string. These strings are used for comparison.
     */
    groupBy: <TKey, TValue = T>(
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue,
        keyStringifier?: (key: TKey) => Keyable
    ) => IterableChain<KeyValue<TKey, TValue[]>>;

    /**
     * Creates a new iterable object that, maps each item of the previous Iterable to other Iterable
     * and iterates each item of the resulting Iterable.
     * @param mapper a function that maps the item to an Iterable.
     */
    flatMap: <R>(mapper: (item: T, index: number) => Iterable<R>) => IterableChain<R>;

    /**
     * Creates a new iterable object that iterates pairs of the previous Iterable items and the other Iterable. If
     * the previous Iterable and the other Iterable have different number of items, the method uses the number of items
     * the smallest Iterable. If mapper is passed, the method does not iterate pairs, but the results of the mapper.
     * @param other an other Iterable.
     * @param mapper a function that returns an iterating value by items of the previous and other Iterables.
     */
    zip: <T2, R = [T, T2]>(other: Iterable<T2>, mapper?: (item1: T, item2: T2) => R) => IterableChain<R>;

    /**
     * Creates a new iterable object that iterates joined items with the other Iterable. The items is joined by keys.
     * The `keySelector` and the `otherKeySelector` function select a key from the items of both Iterables. Joined value
     * of the items of both Iterables is created by `mapper`.
     * @param other an other Iterable.
     * @param keySelector a function that selects the key of the item of the previous Iterable.
     * @param otherKeySelector a function that selects the key of the item of the other Iterable.
     * @param mapper a function that provides a joined value.
     */
    join: <T2, TKey extends Keyable, R>(
        other: Iterable<T2>,
        keySelector: (item1: T) => TKey,
        otherKeySelector: (item2: T2) => TKey,
        mapper: (item1: T, item2: T2) => R
    ) => IterableChain<R>;

    /**
     * Create a new iterable object that iterates items in the sorted order. If `comparer` is passed, it is used to
     * define the order of the result Iterable by comparing two items.
     * @param comparer a function that defines the sort order.
     */
    sort: (comparer?: (a: T, b: T) => number) => IterableChain<T>;

    /**
     * Enumerates Iterable and returns reduced value. The method uses `callback` to define how to reduce the Iterable.
     * By default, the first item of the Iterable is used as initial value of the reduced value. If `initial` param is
     * passed, it is used as initial value. If `initial` is not passed and the Iterable is empty, the method throws an error.
     * @param callback a function that defines how to reduce the Iterable.
     * @param initial a value is used as the initial reduced value.
     */
    reduce: <U = T>(callback: (prev: U, cur: T, index: number) => U, initial?: U) => U;

    /**
     * Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method throws an error.
     * @param condition a function that checks each item of the Iterable. The method returns the first item for which
     * condition returns true.
     */
    first: (condition?: (item: T, index: number) => boolean) => T;

    /**
     * Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the first item for which
     * condition returns true.
     */
    firstOreDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;

    /**
     * Enumerates Iterable and returns the single item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition,
     * the condition is not passed and the Iterable is empty or there are several items that satisfy the condition,
     * the method throws an error.
     * @param condition a function that checks each item of the Iterable. The method returns the single item for which
     * condition returns true.
     */
    single: (condition?: (item: T, index: number) => boolean) => T;
    /**
     * Enumerates Iterable and returns the single item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition or
     * the condition is not passed and the Iterable is empty, the method returns the `defaultValue`. But if there are
     * several items that satisfy the condition, the method throws an error.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the single item for which
     * condition returns true.
     */
    singleOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;

    /**
     * Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not passed,
     * the method returns the last item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method throws an error.
     * @param condition a function that checks each item of the Iterable. The method returns the last item for which
     * condition returns true.
     */
    last: (condition?: (item: T, index: number) => boolean) => T;

    /**
     * Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not passed,
     * the method returns the last item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the last item for which
     * condition returns true.
     */
    lastOrDefault: (defaultValue: T, condition?: (item: T, index: number) => boolean) => T;

    /**
     * Enumerates iterator and returns the number of items that satisfy the condition. If the condition is not passed,
     * returns the number of items in the Iterable.
     * @param condition a function-condition uses an item. The counter is incremented if the function returns true.
     */
    count: (condition?: (item: T, index: number) => boolean) => number;

    /**
     * Enumerates Iterable and returns true if the Iterable contains the passed element. The method uses `===`
     * for comparison by default, but if the comparer is passed, the method uses it.
     * @param element the desired element.
     * @param comparer a function that compare the element and the item of the Iterable.
     * If it returns true - the values are equal.
     */
    contains: (element: T, comparer?: (a: T, b: T) => boolean) => boolean;

    /**
     * Enumerates iterator and returns true if at least one item satisfies the condition. If the condition is not passed,
     * returns true if the Iterable has at least one item.
     * @param condition a function that is used to check.
     */
    some: (condition?: (item: T, index: number) => boolean) => boolean;

    /**
     * Enumerates iterator and returns true if all items satisfy the condition.
     * @param condition a function that is used to check.
     */
    every: (condition: (item: T, index: number) => boolean) => boolean;

    /**
     * Enumerate Iterable and returns the minimum item. Works only with a numeric Iterable.
     */
    min: T extends number ? () => number : never;

    /**
     * Enumerate Iterable and returns the maximum item. Works only with a numeric Iterable.
     */
    max: T extends number ? () => number : never;

    /**
     * Enumerate Iterable and returns the sum of the items. Works only with a numeric Iterable.
     */
    sum: T extends number ? () => number : never;
    [chainMarker]: true;
}

interface NumberChainIterable {
    min: () => number;
    max: () => number;
    sum: () => number;
}

interface FilterOverride<T> {
    <S extends T>(condition: (item: T, index: number) => item is S): IterableChain<S>;

    (condition: (item: T, index: number) => boolean): IterableChain<T>;
}

export function create<T>(source: Iterable<T>): IterableChain<T> {
    const iter: Omit<IterableChain<T>, keyof NumberChainIterable> & NumberChainIterable & Iterable<T> = {
        map: (mapper) => fromGeneratorFunction(mapGenerator, source, mapper,),
        filter: (condition: any) => fromGeneratorFunction(filterGenerator, source, condition),
        append: (element) => fromGeneratorFunction(appendGenerator, source, element),
        prepend: (element) => fromGeneratorFunction(prependGenerator, source, element),
        concat: (other) => fromGeneratorFunction(concatGenerator, source, other),
        skip: (count) => fromGeneratorFunction(skipGenerator, source, count),
        take: (count) => fromGeneratorFunction(takeGenerator, source, count),
        reverse: () => fromGeneratorFunction(reverseGenerator, source),
        distinct: (stringifier) => fromGeneratorFunction(distinctGenerator, source, stringifier),
        except: (other, stringifier) => fromGeneratorFunction(exceptGenerator, source, other, stringifier),
        intersect: (other, stringifier) => fromGeneratorFunction(intersectGenerator, source, other, stringifier),
        union: (other, stringifier) => fromGeneratorFunction(unionGenerator, source, other, stringifier),
        groupBy: (keySelector, valueSelector, keyStringifier) => create(
            groupBy(
                source,
                keySelector,
                valueSelector,
                keyStringifier
            )),
        flatMap: (mapper) => fromGeneratorFunction(flatMapGenerator, source, mapper),
        zip: (other, mapper) => fromGeneratorFunction(zipGenerator, source, other, mapper),
        contains: (element, comparer) => contains(source, element, comparer),
        count: (condition) => count(source, condition),
        every: (condition) => every(source, condition),
        some: (condition) => some(source, condition),
        first: (condition) => first(source, condition),
        firstOreDefault: (defaultValue, condition) => firstOrDefault(source, defaultValue, condition),
        single: (condition) => single(source, condition),
        singleOrDefault: (defaultValue, condition) => singleOrDefault(source, defaultValue, condition),
        last: (condition) => last(source, condition),
        lastOrDefault: (defaultValue, condition) => lastOrDefault(source, defaultValue, condition),
        reduce: function(callback, initial) {
            return arguments.length === 1
                ? reduce(source, callback)
                : reduce(source, callback, initial);
        },
        join: (other, keySelector, otherKeySelector, mapper) => fromGeneratorFunction(
            joinGenerator,
            source,
            other,
            keySelector,
            otherKeySelector,
            mapper
        ),
        sort: (comparer?: (a: T, b: T) => number) => create(sort(source, comparer)),
        max: () => max(source as any),
        min: () => min(source as any),
        sum: () => sum(source as any),
        [Symbol.iterator]: () => source[Symbol.iterator](),
        [chainMarker]: true,
        toArray: () => Array.isArray(source) ? source : Array.from(source),
        toSet: () => source instanceof Set ? source : new Set(source),
        toMap: (keySelector, valueSelector) => source instanceof Map
            ? source
            : toMap(source, keySelector, valueSelector),
        toObject: (keySelector, valueSelector) => toObject(source, keySelector, valueSelector),
    };

    return iter as IterableChain<T>;
}

export function fromGeneratorFunction<Args extends unknown[], R>(
    generatorFunction: (...args: Args) => Generator<R>,
    ...args: Args
): IterableChain<R> {
    return create({ [Symbol.iterator]: () => generatorFunction(...args) });
}
