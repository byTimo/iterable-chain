https://github.com/byTimo/iterable-chain

# Iterable-chain

This library contains a wrapper for productive and convenient manipulation of data collections. This solution uses
similar principles as [LINQ library in C#](https://docs.microsoft.com/en-us/dotnet/standard/linq/).

## The principles

The library combines several manipulations over the source data collection in such a way that new collections will be
allocated and iterated as few times as possible. For example, in the code below the native js array's methods are used.
```javascript
const array = [1, 2, 3, 4, 5, 6].filter(x => x % 2 === 1).map(x => x + 1).slice(0, 2);
```
This code allocates a new array when `filter` is called and a new array for `map`. The code also completely iterates
over the source array and the array after `filter`, but the optimal way uses only the first three items of the source
array. Using `iterable-chain` library this code can be rewritten as
```javascript
import {chain} from 'iterable-chain';

const array = chain([1, 2, 3, 4, 5, 6]).filter(x => x % 2 === 1).map(x => x + 1).take(2).toArray();
```
In this code `chain` function is used to create a wrapper that allows to create a chain of iterators over the source
collection. `filter`, `map` and `take` internally create [iterable objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables).
Each next iterable uses the previous iterable as a source. `toArray` method iterates over the chain and returns the result
array. When `toArray` is called, it takes an item from `take` iterable, which takes an item from `map` iterable, which
takes an item from `filter` iterable, which takes an item from the source array. In the first iteration the first item is taken.
The first item passes `filter`, is modified by `map`, passes `take` and is stored as the first item in the result array.
The second item of the source array is skipped by `filter` iterable and the iterable immediately takes the next one. The
third item passes all conditions, is modified by `map` and is stored as the second item of the result array. After that,
the iteration ends - no more items are taken. If your data collection has thousands of items, you will feel the difference.

## Methods

### Create the wrapper

For creating the wrapper it's used `chain` function. You can use any an iterable object as the parameter.
```javascript
import {chain} from 'iterable-chain';

chain([1, 2, 3, 4, 5])
chain(new Set([1, 2, 3, 4, 5]))
chain(new Map([[1, 1], [2, 2], [3, 3]]))
// or custom Iterable
```
You can also use an object as the parameter. In this case the object is interpreted as `Map` and the result iterable
contains tuples `[key, value]` as items.
```javascript
import {chain} from 'iterable-chain';

chain({a: 10, b: 20}).toArray() // -> [["a", 10], ["b", 10]]
```
As an object `chain` has two special methods for creating iterable object - `range` and `repeat`.

- `range` - `(start: number, count: number) => IterableChain<number>` - Creates a new iterable object that iterates
the range of numbers from `start`. Each next number is the increment of the previous number. The method generates
`count` numbers. Example: `chain.range(0, 10)`
- `repeat` - `<T>(value: T, count: number) => IterableChain<T>` - Create a new iterable object that repeat `value`
`count` times during the iteration. Example: `chain.repeat("some", 5)`

### Wrapper's methods

There are two types of methods. The first type is methods that use a generator and don't iterate the chain of iterables
after call. These methods create a new iterable object. These are methods such as `map`, `filter`, `skip`, `take`, etc. 
The second type is methods that iterate the chain after call and return certain result. These are methods such as
`toArray`, `toMap`, `first`, `every`, `sum`, etc.

Most methods that don't iterate the chain after call iterate the source one by one. But there are methods that iterate
the entire previous chain before they can pass on their first item. For example, the method `reverse` returns iterable object
after call, but it will be able to pass on the first item only after it receives the last item of the previous chain.

Methods that **don't** iterate after call and **don't** iterate the entire previous chain:
- `map` Creates a new iterable object that, during iteration, maps each item of the previous iterable object using the passed function.
  - Signature: `<T, R>(selector: (item: T, index: number) => R) => Iterable<R>` 
  - Example: `chain([1, 2, 3, 4]).map(x => x - 1).toArray() // -> [0, 1, 2, 3]`
- `filter` Creates a new iterable object. During the iteration, it leaves only those items for which the condition returns true.
  - Signature: `<T>(condition: (item: T, index: number) => boolean) => Iterable<T>` 
  - Example: `chain([1, 2, 3, 4]).filter(x => x > 2).toArray() // -> [1]`
- `flatMap` Creates a new iterable object that, maps each item of the previous Iterable to other Iterable and iterates
  each item of the resulting Iterable.
  - Signature: `<T, R>(selector: (item: T, index: number) => Iterable<R>) => Iterable<R>`
  - Example: `chain(["foo", "bar"]).flatMap(x => x.split("")).toArray() // -> ["f", "o", "o", "b", "a", "r"]`
- `append` Creates a new iterable object that iterates all previous values and adds the passed item to the end of the iteration.
  - Signature: `<T>(element: T) => Iterable<T>`
  - Example: `chain([1, 2, 3, 4]).append(7).toArray() // -> [1, 2, 3, 4, 7]`
- `prepend` Creates a new iterable object that iterates all previous values and adds the passed item to the beginning of the iteration.
  - Signature: `<T>(element: T) => Iterable<T>` 
  - Example:`chain([1, 2, 3, 4]).prepand(0).toArray() // -> [0, 1, 2, 3, 4]`
- `concat` Creates a new iterable object that iterates over all previous values, and after all the values of the passed Iterable.
  - Signature: `<T, S>(other: Iterable<S>) => Iterable<T | S>` 
  - Example: `chain([1, 2]).concat([3, 4]).toArray() // -> [1, 2, 3, 4]`
- `skip` Creates a new iterable object that skips the specified number of the items during the iteration. 
If the Iterable has fewer item than the skipped number, an empty Iterable are returned.
  - Signature: `<T>(count: number) => Iterable<T>`
  - Example: `chain([1, 2, 3, 4]).skip(2).toArray() // -> [3, 4]`
- `take` Creates a new iterable object that takes the specified number of the items during the iteration. 
If the Iterable has fewer item than the taken number, all items of the Iterable are iterated.
  - Signature: `<T>(count: number) => Iterable<T>`
  - Example: `chain([1, 2, 3, 4]).take(2).toArray() // -> [1, 2]`
- `distinct` Creates a new iterable object that iterates only unique items. The method uses Set inside, so 
non-primitives values are compared by references. If the stringifier is passed, the method uses its 
results as a values for comparison.
  - Signature: `<T>(stringifier?: (item: T) => string) => Iterable<T>`
  - Examples: 
    - `chain([1, 2, 2, 1]).distinct().toArray() // -> [1, 2]`
    - `chain([{a: 10}, {a: 10}]).distinct(x => x.a).toArray() // -> [{a: 10}]`
- `union` Creates a new iterable object that iterates over all previous values, and after only those items of the 
`other` Iterable that are not in the previous values. The method uses Set inside, 
so non-primitives values are compared by references. If the stringifier is passed, the method uses its results as a 
values for comparison.
  - Signature: `<T>(other: Iterable<T>, stringifier?: (item: T) => string) => Iterable<T>`
  - Examples:
    - `chain([1, 2, 3, 4]).union([5, 4, 3]).toArray() // -> [1, 2, 3, 4, 5]`
    - `chain([{a: 10}, {a: 20}]).union([{a: 20}, {a: 30}], x => x.a).toArray() // -> [{a: 10}, {a: 20}, {a: 30}]`
- `zip` Creates a new iterable object that iterates pairs of the previous Iterable items and the other Iterable. 
If the previous Iterable and the other Iterable have different number of items, 
the method uses the number of items the smallest Iterable. If mapper is passed, the method does not iterate 
pairs, but the results of the mapper.
  - Signature: `<T1, T2, R = [T1, T2]>(other: Iterable<T2>, mapper?: (a: T1, b: T2) => R) => Iterable<R>`
  - Examples:
    - `chain([1, 2, 3]).zip([3, 2, 1]).toArray() // -> [[1, 3], [2, 2], [3, 1]]`
    - `chain([1, 2, 3]).zip([3, 2, 1], (a, b) => a + b).toArray() // -> [4, 4, 4]`

Methods that **don't** iterate after call, but either iterate the entire previous chain or do other side effect:
- `reverse` Creates a new iterable object that reverses the order of the items.
  - Signature: `<T>() => Iterable<T>`
  - Side effect: iterates the entire previous chain before passes on the first item
  - Example: `chain([1, 2, 3, 4]).reverse().toArray() // -> [4, 3, 2, 1]`
- `except` Creates a new iterable object that iterates only those items that are not in `other` Iterable. The method 
uses Set inside, so non-primitives values are compared by references. If the stringifier is passed, 
the method uses its results as a values for comparison.
  - Signature: `<T>(other: Iterable<T>, stringifier?: (item: T) => string) => Iterable<T>`
  - Side effect: iterates the `other` iterable
  - Examples:
    - `chain([1, 2, 3, 4]).except([2, 3, 5]).toArray() // -> [1, 4]`
    - `chain([{a: 10}, {a: 20}, {a: 30}]).except([{a: 10}, {a: 50}], x => x.a).toArray() // -> [{a: 20}, {a: 30}]`
- `intersect` Creates a new iterable object that iterates only those items that are in `other` Iterable. The method 
uses Set inside, so non-primitives values are compared by references. If the stringifier is passed, the method uses its
results as a values for comparison.
  - Signature: `<T>(other: Iterable<T>, stringifier?: (item: T) => string) => Iterable<T>`
  - Side effect: iterates the `other` iterable
  - Examples:
    - `chain([1, 2, 3, 4]).intersect([2, 3, 5]).toArray() // -> [2, 3]`
    - `chain([{a: 10}, {a: 20}, {a: 30}]).intersect([{a: 10}, {a: 50}], x => x.a).toArray() // -> [{a: 10}]`
- `groupBy` Creates a new iterable object that groups all items and iterates the groups. The groups are created by 
keys that provide by the `keySelector` function. Each group may have multiple values, so each group is 
represented by a tuple `[key, value[]]`. By default, the iterable item value is used as the group value, but 
if `valueSelector` is passed, result of the `valueSelector` is used as the group value. The method uses {} for grouping
inside, so for non-primitives values of keys is used `toString` method. If `keyStringifier` is passed, the method uses
its results for grouping inside, but does not change outgoing keys.
  - Signature: `<T, TKey, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue, keyStringifier?: (key: TKey) => Keyable) => Iterable<KeyValue<TKey, TValue[]>>`
  - Side effect: iterates the entire previous chain before passes on the first item
  - Examples:
      - `chain([{type: "a", value: 10}, {type: "b", value: 10}]).groupBy(x => x.type).toArray() // -> [["a", [{type: "a", value: 10}]], ["b", [{type: "b", value: 10}]]]`
      - `chain([{type: "a", value: 10}, {type: "b", value: 10}]).groupBy(x => x.type, x => x.value).toArray() // -> [["a", [10]], ["b", [10]]]`
      - `chain([{type: "a", value: 10}, {type: "b", value: 10}]).groupBy(x => x, x => x.value, key => key.type).toArray() // -> [[{type: "a", value: 10}, [10]], [{type: "b", value: 10}, [10]]]`
- `join` Creates a new iterable object that iterates joined items with the other Iterable. The items are joined by keys. 
The `keySelector` and the `otherKeySelector` function select a key from the items of both Iterables. Joined value of 
the items of both Iterables is created by `mapper`.
  - Signature: `<T1, T2, TKey extends Keyable, R>(other: Iterable<T2>, sourceKeySelector: (item: T1) => TKey, otherKeySelector: (item: T2) => TKey, mapper: (a: T1, b: T2) => R) => Iterable<R>`
  - Side effect: iterates the entire previous chain before passes on the first item
  - Examples:
    - `chain([{a: 10}, {a: 20}]).join([{b: 10}, {b: 30}], f => f.a, s => s.b, (f, s) => {...f, ...s}).toArray() // -> [{a: 10, b: 10}]`
- `sort` Create a new iterable object that iterates items in the sorted order. If `comparer` is passed, it is used to 
define the order of the result Iterable by comparing two items.
  - Signature: `<T>(comparer?: (a: T, b: T) => number) => Iterable<T>`
  - Side effect: iterates the entire previous chain before passes on the first item
  - Examples:
    - `chain([4, 3, 1, 2]).sort().toArray() // -> [1, 2, 3, 4]`
    - `chain([4, 1, 10, 2]).sort().toArray() // -> [1, 10, 2, 4] like js sort`
    - `chain([4, 1, 10, 2]).sort((a, b) => a - b) // [1, 2, 4, 10]`

Methods that **iterate** after call:
- `toArray` Converts the iterable into an array.
  - Signature: `<T>() => T[]`
  - Example: `chain([1, 2, 3, 4]).toArray() // -> [1, 2, 3, 4]`
- `toSet` Converts the iterable into a set
  - Signature: `<T>() => Set<T>`
  - Example: `chain([1, 2, 2, 1]).toSet() // -> Set([1, 2])`
- `toMap` Converts the iterable into a Map. The Map is created by keys that provide by the `keySelector` function. By
default, the iterable item value is used as the map value, but if `valueSelector` is passed, result of the
`valueSelector` is used as the map value.
  - Signature: `<TKey extends Keyable, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Map<TKey, TValue>`
  - Examples:
    - `chain([{type: "a", value: 10}, {type: "b", value: 20]).toMap(x => x.type) // -> Map(a -> {type: "a", value: 10}, b -> {type: "b", value: 20})`
    - `chain([{type: "a", value: 10}, {type: "b", value: 20]).toMap(x => x.type, x => x.value) // -> Map(a -> 10, b -> 20)`
- `toObject` Converts the iterable into an object. The object is created by keys that provide by the `keySelector` function.
By default, the iterable item value is used as the object value, but if `valueSelector` is passed, result of
the `valueSelector` is used as the object value.
  - Signature: `<TKey extends Keyable, TValue = T>(keySelector: (item: T) => TKey, valueSelector?: (item: T) => TValue) => Record<TKey, TValue>`
  - Examples:
    - `chain([{type: "a", value: 10}, {type: "b", value: 20]).toObject(x => x.type) // -> {a: {type: "a", value: 10}, b: {type: "b", value: 20}}`
    - `chain([{type: "a", value: 10}, {type: "b", value: 20]).toObject(x => x.type, x => x.value) // -> {a: 10, b: 20}`
- `reduce` Enumerates Iterable and returns reduced value. The method uses `callback` to define how to reduce the 
Iterable. By default, the first item of the Iterable is used as initial value of the reduced value. If `initial` param 
is passed, it is used as initial value. If `initial` is not passed and the Iterable is empty, the method throws an error.
  - Signature:
  - Examples:
    - `chain([1, 2, 3, 4]).reduce((acc, cur) => acc + cur); // -> 10`
    - `chain([1, 2, 3, 4]).reduce((acc, cur) => acc + cur, 1); // -> 11`
    - `chain([1, 2, 3, 4]).reduce((acc, cur) => acc + cur, ""); // -> "1234"`
- `first` Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not passed, 
the method returns the first item of the Iterable. If there is no item that satisfies the condition or the condition is 
not passed and the Iterable is empty, the method throws an error.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).first() // -> 1`
    - `chain([1, 2, 3, 4]).first(x => x > 2) // -> 3`
    - `chain([1, 2, 3, 4]).first(x => x > 4) // throw Error`
- `firstOrDefault` Enumerates Iterable and returns the first item that satisfies the condition. If the condition is not 
passed, the method returns the first item of the Iterable. If there is no item that satisfies the condition or the 
condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
  - Signature: `<T>(defaultValue: T, condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).firstOrDefault(5) // -> 1`
    - `chain([1, 2, 3, 4]).firstOrDefault(5, x => x > 2) // -> 3`
    - `chain([1, 2, 3, 4]).firstOrDefault(5, x => x > 4) // -> 5`
- `single` Enumerates Iterable and returns the single item that satisfies the condition. If the condition is not passed,
the method returns the first item of the Iterable. If there is no item that satisfies the condition, the condition is 
not passed and the Iterable is empty or there are several items that satisfy the condition, the method throws an error.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).single() // throw Error`
    - `chain([1, 2, 3, 4]).single(x => x > 3) // -> 4`
    - `chain([1, 2, 3, 4]).single(x => x > 4) // throw Error`
- `singleOrDefault` Enumerates Iterable and returns the single item that satisfies the condition. If the condition is 
not passed, the method returns the first item of the Iterable. If there is no item that satisfies the condition or the 
condition is not passed and the Iterable is empty, the method returns the `defaultValue`. But if there are several items
that satisfy the condition, the method throws an error.
  - Signature: `<T>(defaultValue: T, condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).singleOrDefault(5) // throw Error`
    - `chain([1, 2, 3, 4]).singleOrDefault(5, x => x > 3) // -> 4`
    - `chain([1, 2, 3, 4]).singleOrDefault(5, x => x > 4) // -> 5`
- `last` Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not passed, 
the method returns the last item of the Iterable. If there is no item that satisfies the condition or the condition is 
not passed and the Iterable is empty, the method throws an error.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).last() // -> 4`
    - `chain([1, 2, 3, 4]).last(x => x < 3) // -> 2`
    - `chain([1, 2, 3, 4]).last(x => x < 0) // throw Error`
- `lastOrDefault` Enumerates Iterable and returns the last item that satisfies the condition. If the condition is not 
passed, the method returns the last item of the Iterable. If there is no item that satisfies the condition or the 
condition is not passed and the Iterable is empty, the method returns the `defaultValue`.
  - Signature: `<T>(defaultValue: T, condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).lastOrDefault(5) // -> 4`
    - `chain([1, 2, 3, 4]).lastOrDefault(5, x => x < 3) // -> 2`
    - `chain([1, 2, 3, 4]).lastOrDefault(5, x => x < 0) // -> 5`
- `count` Enumerates iterator and returns the number of items that satisfy the condition. If the condition is not passed, 
returns the number of items in the Iterable.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).count() // -> 4`
    - `chain([1, 2, 3, 4]).count(x => x > 2) // -> 2`
    - `chain([1, 2, 3, 4]).count(x => x < 0) // -> 0`
- `contains` Enumerates Iterable and returns true if the Iterable contains the passed element. The method uses `===`for 
comparison by default, but if the comparer is passed, the method uses it.
  - Signature: `<T>(element: T, comparer?: (a: T, b: T) => boolean) => boolean`
  - Examples: 
    - `chain([1, 2, 3, 4]).contains(3) // -> true`
    - `chain([{a: 10}, {b: 10}]).contains({a: 10}) // -> false`
    - `chain([{a: 10}, {b: 10}]).contains({a: 10}, (a, b) => a.a === b.a) // -> true`
- `some` Enumerates iterator and returns true if at least one item satisfies the condition. If the condition is not passed, 
returns true if the Iterable has at least one item.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).some() // -> true`
    - `chain([1, 2, 3, 4]).some(x => x > 2) // -> true`
    - `chain([1, 2, 3, 4]).some(x => x < 0) // -> false`
- `every` Enumerates iterator and returns true if all items satisfy the condition.
  - Signature: `<T>(condition?: (item: T, index: number) => boolean) => T`
  - Examples:
    - `chain([1, 2, 3, 4]).every(x => x > 2) // -> false`
    - `chain([1, 2, 3, 4]).every(x => x < 5) // -> true`
- `min` Enumerate Iterable and returns the minimum item. Works only with a numeric Iterable.
  - Signature: `() => number`
  - Example: `chain([1, 2, 3, 4]).min() // -> 1`
- `max` Enumerate Iterable and returns the maximum item. Works only with a numeric Iterable.
  - Signature: `() => number`
  - Example: `chain([1, 2, 3, 4]).max() // -> 4`
- `sum` Enumerate Iterable and returns the sum of the items. Works only with a numeric Iterable.
  - Signature: `() => number`
  - Example: `chain([1, 2, 3, 4]).sum() // -> 10`
