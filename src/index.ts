import { IterableChain, create, fromGeneratorFunction } from "./iterableChain";
import {
    appendGenerator,
    concatGenerator,
    distinctGenerator,
    exceptGenerator,
    filterGenerator,
    intersectGenerator,
    mapGenerator,
    prependGenerator,
    rangeGenerator,
    repeatGenerator,
    reverseGenerator,
    skipGenerator,
    takeGenerator,
    unionGenerator,
    flatMapGenerator,
    objectGenerator,
    zipGenerator,
    joinGenerator
} from "./generators";
import {
    contains,
    count,
    every,
    first,
    firstOrDefault,
    last,
    lastOrDefault,
    single,
    singleOrDefault,
    some,
    reduce,
    min,
    max,
    sum,
    groupBy,
    sort
} from "./functions";
import { isIterable, KeyValue, IterableObject, Keyable } from "./common";

export interface Chain {
    /**
     * The function creates wrapper around an iterable or an object. The wrapper provides methods for creating
     * a data modification chain.
     * @param source any iterable like array, map, set or generator
     */
    <T>(source: Iterable<T>): IterableChain<T>;

    /**
     * The function creates wrapper around iterable collection or object. The wrapper provides methods for creating
     * a data modification chain.
     * @param source any object that will be transformed into Iterable<[key, value]>
     */
    <TValue = unknown, TKey extends Keyable = Keyable>(source: IterableObject<TValue, TKey>): IterableChain<KeyValue<TKey, TValue>>;

    /**
     * Creates a new iterable object that iterates the range of numbers from `start`. Each next number is the increment
     * of the previous number. The method generates `count` numbers.
     * @param start a number that starts a range.
     * @param count a number of numbers.
     */
    range: (start: number, count: number) => IterableChain<number>;

    /**
     * Create a new iterable object that repeat `value` `count` times during the iteration.
     * @param value a repeating value.
     * @param count a number of repeated times.
     */
    repeat: <T>(value: T, count: number) => IterableChain<T>;

    /**
     * Creates a new iterable object that, during iteration,
     * maps each item of the previous iterable object using the passed function.
     * @param source an Iterable.
     * @param mapper a function that maps an item to an item in the next iterable.
     */
    map: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => R) => IterableChain<R>;

    /**
     * Creates a new iterable object. During the iteration,
     * it leaves only those items for which the condition returns true.
     * @param source an Iterable.
     * @param condition a function that has to returns true for item if this item doesn't need to be skipped.
     */
    filter: typeof filter;

    /**
     * Creates a new iterable object that iterates all previous values and adds the passed item to the end of the iteration.
     * @param source an Iterable.
     * @param element is added to the end of the iteration.
     */
    append: <T>(source: Iterable<T>, element: T) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates all previous values and adds the passed item to the beginning of the iteration.
     * @param source an Iterable.
     * @param element is added to the beginning of the iteration.
     */
    prepend: <T>(source: Iterable<T>, element: T) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates over all previous values, and after all the values of the passed Iterable.
     * @param source an Iterable.
     * @param other a Iterable whose values are iterated after the previous values.
     */
    concat: <T, S>(source: Iterable<T>, other: Iterable<S>) => IterableChain<T | S>;

    /**
     * Creates a new iterable object that skips the specified number of the items during the iteration. If the Iterable
     * has fewer item than the skipped number, an empty Iterable are returned.
     * @param source an Iterable.
     * @param count the number of the skipping items.
     */
    skip: <T>(source: Iterable<T>, count: number) => IterableChain<T>;

    /**
     * Creates a new iterable object that takes the specified number of the items during the iteration. If the Iterable
     * has fewer item than the taken number, all items of the Iterable are iterated.
     * @param source an Iterable.
     * @param count the number of the taken items.
     */
    take: <T>(source: Iterable<T>, count: number) => IterableChain<T>;

    /**
     * Creates a new iterable object that reverses the order of the items.
     * @param source an Iterable.
     */
    reverse: <T>(source: Iterable<T>) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only unique items. The method uses Set inside, so non-primitives values
     * are compared by references. If the stringifier is passed, the method uses its results as a values for comparison.
     * @param source an Iterable.
     * @param stringifier a function that transforms each item of the Iterable to a string. These strings are used for comparison.
     */
    distinct: <T>(source: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only those items that are not in `other` Iterable. The method uses
     * Set inside, so non-primitives values are compared by references. If the stringifier is passed, the method uses
     * its results as a values for comparison.
     * @param source an Iterable.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    except: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates only those items that are in `other` Iterable. The method uses
     * Set inside, so non-primitives values are compared by references. If the stringifier is passed, the method uses
     * its results as a values for comparison.
     * @param source an Iterable.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    intersect: <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that iterates over all previous values, and after only those items of the `other`
     * Iterable that are not in the previous values. The method uses Set inside, so non-primitives values are compared
     * by references. If the stringifier is passed, the method uses its results as a values for comparison.
     * @param source an Iterable.
     * @param other a Iterable whose values are iterated after the previous values.
     * @param stringifier a function that transforms each item of Iterables to a string. These strings are used for comparison.
     */
    union: <T>(source: Iterable<T>, other: Iterable<T>, stringifier?: (item: T) => string) => IterableChain<T>;

    /**
     * Creates a new iterable object that groups all items and iterates the groups. The groups are created by keys that
     * provide by the `keySelector` function. Each group may have multiple values, so each group is represented by a
     * tuple `[key, value[]]`. By default, the iterable item value is used as the group value, but if `valueSelector` is
     * passed, result of the `valueSelector` is used as the group value. The method uses {} for grouping inside, so for
     * non-primitives values of keys is used `toString` method. If `keyStringifier` is passed, the method uses its
     * results for grouping inside, but does not change outgoing keys.
     * @param source an Iterable.
     * @param keySelector a function that selects the key form the item.
     * @param valueSelector a function that selects the value from the item.
     * @param keyStringifier a function that transforms each key of the item to a string. These strings are used for comparison.
     */
    groupBy: <T, TKey, TValue = T>(
        source: Iterable<T>,
        keySelector: (item: T) => TKey,
        valueSelector?: (item: T) => TValue,
        keyStringifier?: (key: TKey) => Keyable,
    ) => IterableChain<KeyValue<TKey, TValue[]>>;

    /**
     * Creates a new iterable object that, maps each item of the previous Iterable to other Iterable
     * and iterates each item of the resulting Iterable.
     * @param source an Iterable.
     * @param mapper a function that maps the item to an Iterable.
     */
    flatMap: <T, R>(source: Iterable<T>, selector: (item: T, index: number) => Iterable<R>) => IterableChain<R>;

    /**
     * Creates a new iterable object that iterates pairs of the previous Iterable items and the other Iterable. If
     * the previous Iterable and the other Iterable have different number of items, the method uses the number of items
     * the smallest Iterable. If mapper is passed, the method does not iterate pairs, but the results of the mapper.
     * @param source an Iterable.
     * @param other an other Iterable.
     * @param mapper a function that returns an iterating value by items of the previous and other Iterables.
     */
    zip: <T1, T2, R = [T1, T2]>(
        source: Iterable<T1>,
        other: Iterable<T2>,
        mapper?: (a: T1, b: T2) => R
    ) => IterableChain<R>,

    /**
     * Creates a new iterable object that iterates joined items with the other Iterable. The items are joined by keys.
     * The `keySelector` and the `otherKeySelector` function select a key from the items of both Iterables. Joined value
     * of the items of both Iterables is created by `mapper`.
     * @param source an Iterable.
     * @param other an other Iterable.
     * @param keySelector a function that selects the key of the item of the previous Iterable.
     * @param otherKeySelector a function that selects the key of the item of the other Iterable.
     * @param mapper a function that provides a joined value.
     */
    join: <T1, T2, TKey extends Keyable, R>(
        source: Iterable<T1>,
        other: Iterable<T2>,
        sourceKeySelector: (item: T1) => TKey,
        otherKeySelector: (item: T2) => TKey,
        mapper: (a: T1, b: T2) => R
    ) => IterableChain<R>;

    /**
     * Create a new iterable object that iterates items in the sorted order. If `comparer` is passed, it is used to
     * define the order of the result Iterable by comparing two items.
     * @param source an Iterable.
     * @param comparer a function that defines the sort order.
     */
    sort: <T>(source: Iterable<T>, comparer?: (a: T, b: T) => number) => IterableChain<T>;

    /**
     * Enumerates Iterable and returns reduced value. The method uses `callback` to define how to reduce the Iterable.
     * By default, the first item of the Iterable is used as initial value of the reduced value. If `initial` param is
     * passed, it is used as initial value. If `initial` is not passed and the Iterable is empty, the method throws an error.
     * @param source an Iterable.
     * @param callback a function that defines how to reduce the Iterable.
     * @param initial a value is used as the initial reduced value.
     */
    reduce: typeof reduce;

    /**
     * Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method throws an error.
     * @param source an Iterable.
     * @param condition a function that checks each item of the Iterable. The method returns the first item for which
     * condition returns true.
     */
    first: typeof first;

    /**
     * Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
     * @param source an Iterable.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the first item for which
     * condition returns true.
     */
    firstOrDefault: typeof firstOrDefault;

    /**
     * Enumerates Iterable and returns the single item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition,
     * the condition is not passed and the Iterable is empty or there are several items that satisfy the condition,
     * the method throws an error.
     * @param source an Iterable.
     * @param condition a function that checks each item of the Iterable. The method returns the single item for which
     * condition returns true.
     */
    single: typeof single;

    /**
     * Enumerates Iterable and returns the single item that satisfies the condition. If the condition is not passed,
     * the method returns the first item of the Iterable. If there is no item that satisfies the condition or
     * the condition is not passed and the Iterable is empty, the method returns the `defaultValue`. But if there are
     * several items that satisfy the condition, the method throws an error.
     * @param source an Iterable.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the single item for which
     * condition returns true.
     */
    singleOrDefault: typeof singleOrDefault;

    /**
     * Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not passed,
     * the method returns the last item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method throws an error.
     * @param source an Iterable.
     * @param condition a function that checks each item of the Iterable. The method returns the last item for which
     * condition returns true.
     */
    last: typeof last;

    /**
     * Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not passed,
     * the method returns the last item of the Iterable. If there is no item that satisfies the condition
     * or the condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
     * @param source an Iterable.
     * @param defaultValue a value that is returned if the Iterable doesn't have items that satisfy the condition.
     * @param condition a function that checks each item of the Iterable. The method returns the last item for which
     * condition returns true.
     */
    lastOrDefault: typeof lastOrDefault;

    /**
     * Enumerates iterator and returns the number of items that satisfy the condition. If the condition is not passed,
     * returns the number of items in the Iterable.
     * @param source an Iterable.
     * @param condition a function-condition uses an item. The counter is incremented if the function returns true.
     */
    count: typeof count;

    /**
     * Enumerates Iterable and returns true if the Iterable contains the passed element. The method uses `===`
     * for comparison by default, but if the comparer is passed, the method uses it.
     * @param source an Iterable.
     * @param element the desired element.
     * @param comparer a function that compare the element and the item of the Iterable.
     * If it returns true - the values are equal.
     */
    contains: typeof contains;

    /**
     * Enumerates iterator and returns true if at least one item satisfies the condition. If the condition is not passed,
     * returns true if the Iterable has at least one item.
     * @param source an Iterable.
     * @param condition a function that is used to check.
     */
    some: typeof some;

    /**
     * Enumerates iterator and returns true if all items satisfy the condition.
     * @param source an Iterable.
     * @param condition a function that is used to check.
     */
    every: typeof every;

    /**
     * Enumerate Iterable and returns the minimum item. Works only with a numeric Iterable.
     * @param source an Iterable.
     */
    min: typeof min;

    /**
     * Enumerate Iterable and returns the maximum item. Works only with a numeric Iterable.
     * @param source an Iterable.
     */
    max: typeof max;

    /**
     * Enumerate Iterable and returns the sum of the items. Works only with a numeric Iterable.
     * @param source an Iterable.
     */
    sum: typeof sum;
}

export const chain: Chain = (function() {
    const func: any = function(source: any) {
        if (isIterable(source)) {
            return create(source);
        }
        return fromGeneratorFunction(objectGenerator, source);
    };

    func.range = function(start: number, count: number): IterableChain<number> {
        return fromGeneratorFunction(rangeGenerator, start, count);
    };
    func.repeat = function <T>(value: T, count: number): IterableChain<T> {
        return fromGeneratorFunction(repeatGenerator, value, count);
    };
    func.map = function <T, R>(source: Iterable<T>, mapper: (item: T, index: number) => R) {
        return fromGeneratorFunction(mapGenerator, source, mapper);
    };
    func.filter = filter;
    func.append = function <T>(source: Iterable<T>, element: T) {
        return fromGeneratorFunction(appendGenerator, source, element);
    };
    func.prepend = function <T>(source: Iterable<T>, element: T) {
        return fromGeneratorFunction(prependGenerator, source, element);
    };
    func.concat = function <T, S>(source: Iterable<T>, other: Iterable<S>) {
        return fromGeneratorFunction(concatGenerator, source, other);
    };
    func.skip = function <T>(source: Iterable<T>, count: number): IterableChain<T> {
        return fromGeneratorFunction(skipGenerator, source, count);
    };
    func.take = function <T>(source: Iterable<T>, count: number): IterableChain<T> {
        return fromGeneratorFunction(takeGenerator, source, count);
    };
    func.reverse = function <T>(source: Iterable<T>): IterableChain<T> {
        return fromGeneratorFunction(reverseGenerator, source);
    };
    func.distinct = function <T>(source: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
        return fromGeneratorFunction(distinctGenerator, source, stringifier);
    };
    func.except =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(exceptGenerator, first, second, stringifier);
        };
    func.intersect =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(intersectGenerator, first, second, stringifier);
        };
    func.union =
        function <T>(first: Iterable<T>, second: Iterable<T>, stringifier?: (item: T) => string): IterableChain<T> {
            return fromGeneratorFunction(unionGenerator, first, second, stringifier);
        };
    func.groupBy =
        function <T, TKey, TValue = T>(
            source: Iterable<T>,
            keySelector: (item: T) => TKey,
            valueSelector?: (item: T) => TValue,
            keyStringifier?: (key: TKey) => Keyable
        ) {
            return create(groupBy(source, keySelector, valueSelector, keyStringifier));
        };
    func.flatMap =
        function <T, R>(source: Iterable<T>, mapper: (item: T, index: number) => Iterable<R>): IterableChain<R> {
            return fromGeneratorFunction(flatMapGenerator, source, mapper);
        };
    func.zip =
        function <T1, T2, R = [T1, T2]>(
            source1: Iterable<T1>,
            source2: Iterable<T2>,
            mapper?: (item1: T1, item2: T2) => R
        ): IterableChain<R> {
            return fromGeneratorFunction(zipGenerator, source1, source2, mapper);
        };
    func.join =
        function <T1, T2, TKey extends Keyable, R>(
            source1: Iterable<T1>,
            source2: Iterable<T2>,
            source1KeyProvider: (item: T1) => TKey,
            source2KeyProvider: (item: T2) => TKey,
            mapper: (item1: T1, item2: T2) => R
        ): IterableChain<R> {
            return fromGeneratorFunction(
                joinGenerator,
                source1,
                source2,
                source1KeyProvider,
                source2KeyProvider,
                mapper
            );
        };
    func.sort = function <T>(source: Iterable<T>, comparer?: (a: T, b: T) => number) {
        return create(sort(source, comparer));
    };
    func.some = some;
    func.every = every;
    func.count = count;
    func.contains = contains;
    func.first = first;
    func.firstOrDefault = firstOrDefault;
    func.single = single;
    func.singleOrDefault = singleOrDefault;
    func.last = last;
    func.lastOrDefault = lastOrDefault;
    func.reduce = reduce;
    func.min = min;
    func.max = max;
    func.sum = sum;
    return func;
})();

function filter<T, S extends T>(source: Iterable<T>, condition: (item: T, index: number) => item is S): IterableChain<S>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean): IterableChain<T>
function filter<T>(source: Iterable<T>, condition: (item: T, index: number) => boolean) {
    return fromGeneratorFunction(filterGenerator, source, condition);
}
