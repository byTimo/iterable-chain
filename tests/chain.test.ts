import {chain} from "../src";

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

//TODO (byTimo) Set, Map, Record
describe("chain global", () => {
    describe("generators", () => {
        describe("range", () => {
            it("start from zero", () => {
                const actual = chain.range(0, 5).array;
                expect(actual).toEqual([0, 1, 2, 3, 4]);
            });
            it("start from 5", () => {
                const actual = chain.range(5, 5).array;
                expect(actual).toEqual([5, 6, 7, 8, 9]);
            });
            it("count is zero", () => {
                const actual = chain.range(5, 0).array;
                expect(actual).toEqual([]);
            });
            it("count less then zero", () => {
                const actual = chain.range(5, -1).array;
                expect(actual).toEqual([]);
            });
        });
        describe("repeat", () => {
            it("repeat number", () => {
                const actual = chain.repate(10, 5).array;
                expect(actual).toEqual([10, 10, 10, 10, 10]);
            });
            it("repeat object", () => {
                const obj = {a: 10};
                const actual = chain.repate(obj, 3).array;
                expect(actual).toEqual([obj, obj, obj]);
                expect(actual[0]).toBe(obj);
                expect(actual[1]).toBe(obj);
                expect(actual[2]).toBe(obj);
            });
        });
        it("map", () => {
            const actual = chain.map([1, 2, 3, 4], x => x + 50).array;
            expect(actual).toEqual([51, 52, 53, 54]);
        });
        describe("filter", () => {
            it("array - condition return boolean", () => {
                const actual = chain.filter([1, 2, 3, 4], x => x % 2 == 0).array;
                expect(actual).toEqual([2, 4]);
            });
            it("array - type guard", () => {
                const actual = chain.filter([1, "2", 3, "4"], isNumber).array;
                const first: number = actual[0]; //type check
                expect(actual).toEqual([1, 3]);
            });
        });
    });
    describe("some", () => {
        it("without condition", () => {
            const falsyActual = chain.some([undefined, false, "", 0, null]);
            const truthyActual = chain.some([undefined, false, "", 0, null, 1]);
            expect(falsyActual).toBeFalsy();
            expect(truthyActual).toBeTruthy();
        });
        it("with condition", () => {
            const actual = chain.some([1, 2, 3, 4], x => x === 3);
            expect(actual).toBeTruthy();
        });
        describe("append, prepend, concat", () => {
            it("append", () => {
                const actual = chain.append([1, 2, 3, 4, 5], 15).array;
                expect(actual).toEqual([15, 1, 2, 3, 4, 5]);
            });
            it("prepend", () => {
                const actual = chain.prepend([1, 2, 3, 4, 5], 15).array;
                expect(actual).toEqual([1, 2, 3, 4, 5, 15]);
            });
            it("concat same type", () => {
                const actual = chain.concat([1, 2, 3], [4, 5, 6]).array;
                expect(actual).toEqual([1, 2, 3, 4, 5, 6]);
            });
            it("concat different types", () => {
                const actual = chain.concat([1, 2, 3], ["4", "5", "6"]).array;
                expect(actual).toEqual([1, 2, 3, "4", "5", "6"]);
            });
        });
        describe("skip", () => {
            it("empty collection, count is greater of zero", () => {
                const actual = chain.skip([], 50).array;
                expect(actual).toEqual([]);
            });
            it("not empty collection, count is zero", () => {
                const actual = chain.skip([1, 2, 3], 0).array;
                expect(actual).toEqual([1, 2, 3]);
            });
            it("skip 3 items", () => {
                const actual = chain.skip([1, 2, 3, 4], 3).array;
                expect(actual).toEqual([4]);
            });
        });
        describe("take", () => {
            it("empty collection, count is greater of zero", () => {
                const actual = chain.take([], 50).array;
                expect(actual).toEqual([]);
            });
            it("not empty collection, count is zero", () => {
                const actual = chain.take([1, 2, 3], 0).array;
                expect(actual).toEqual([]);
            });
            it("take 3 items", () => {
                const actual = chain.take([1, 2, 3, 4], 3).array;
                expect(actual).toEqual([1, 2, 3]);
            });
        });
        describe("reverse", () => {
            it("reverse", () => {
                const actual = chain.reverse([1, 2, 3, 4]).array;
                expect(actual).toEqual([4, 3, 2, 1]);
            });
        });
        describe("distinct", () => {
            it("number collection", () => {
                const actual = chain.distinct([1, 1, 2, 3, 4, 4, 10]).array;
                expect(actual).toEqual([1, 2, 3, 4, 10]);
            });
            it("object collection without stringifier - distinct don't work", () => {
                const actual = chain.distinct([{a: 10}, {a: 10}]).array;
                expect(actual).toEqual([{a: 10}, {a: 10}]);
            });
            it("object collection with stringifier", () => {
                const actual = chain.distinct([{a: 10}, {a: 10}], x => x.a.toString()).array;
                expect(actual).toEqual([{a: 10}]);
            });
        });
        describe("except", () => {
            it("number collection", () => {
                const actual = chain.except([1, 2, 3], [2, 3, 4]).array;
                expect(actual).toEqual([1]);
            });
            it("object collection without stringifier - distinct don't work", () => {
                const actual = chain.except([{a: 10}, {a: 15}], [{a: 15}]).array;
                expect(actual).toEqual([{a: 10}, {a: 15}]);
            });
            it("object collection with stringifier", () => {
                const actual = chain.except([{a: 10}, {a: 15}], [{a: 15}], x => x.a.toString()).array;
                expect(actual).toEqual([{a: 10}]);
            });
        });
        describe("intersect", () => {
            it("number collection", () => {
                const actual = chain.intersect([1, 2, 3], [2, 3, 4]).array;
                expect(actual).toEqual([2, 3]);
            });
            it("object collection without stringifier - distinct don't work", () => {
                const actual = chain.intersect([{a: 10}, {a: 15}], [{a: 15}]).array;
                expect(actual).toEqual([]);
            });
            it("object collection with stringifier", () => {
                const actual = chain.intersect([{a: 10}, {a: 15}], [{a: 15}], x => x.a.toString()).array;
                expect(actual).toEqual([{a: 15}]);
            });
        });
        describe("union", () => {
            it("number collection", () => {
                const actual = chain.union([1, 2, 3], [2, 3, 4]).array;
                expect(actual).toEqual([1, 2, 3, 4]);
            });
            it("object collection without stringifier - distinct don't work", () => {
                const actual = chain.union([{a: 10}, {a: 15}], [{a: 15}]).array;
                expect(actual).toEqual([{a: 10}, {a: 15}, {a: 15}]);
            });
            it("object collection with stringifier", () => {
                const actual = chain.union([{a: 10}, {a: 15}], [{a: 15}], x => x.a.toString()).array;
                expect(actual).toEqual([{a: 10}, {a: 15}]);
            });
        });
        describe("groupBy", () => {
            it("group", () => {
                const actual = chain.groupBy([1, 2, 3, 4, 5], x => x % 2).array;
                expect(actual).toEqual([{key: "0", value: [2, 4]}, {key: "1", value: [1, 3, 5]}]);
            });
            it("group object without value selector", () => {
                const actual = chain.groupBy([{a: 10, b: 20}, {a: 10, b: 30}], x => x.a).array;
                expect(actual).toEqual([{key: "10", value: [{a: 10, b: 20}, {a: 10, b: 30}]}]);
            });
            it("group object with value selector", () => {
                const actual = chain.groupBy([{a: 10, b: 20}, {a: 10, b: 30}], x => x.a, x => x.b).array;
                expect(actual).toEqual([{key: "10", value: [20, 30]}]);
            });
        });
        describe("groupComparedBy", () => {
            it("number collection", () => {
                const actual = chain.groupComparedBy([1, 2, 3, 4, 5], x => x % 2).array;
                expect(actual).toEqual([{key: 1, value: [1, 3, 5]}, {key: 0, value: [2, 4]}]);
            });
            it("key is object, without comparer and value selector", () => {
                const actual = chain.groupComparedBy([
                    {a: {c: true}, b: 20},
                    {a: {c: true}, b: 5},
                    {a: {c: false}, b: 20}
                ], x => x.a).array;
                expect(actual).toEqual([
                    {key: {c: true}, value: [{a: {c: true}, b: 20}]},
                    {key: {c: true}, value: [{a: {c: true}, b: 5}]},
                    {key: {c: false}, value: [{a: {c: false}, b: 20}]}
                ]);
            });
            it("key is object with comparer, without value selector", () => {
                const actual = chain.groupComparedBy([
                    {a: {c: true}, b: 20},
                    {a: {c: true}, b: 5},
                    {a: {c: false}, b: 20}
                ], x => x.a, (a, b) => a.c === b.c).array;
                expect(actual).toEqual([
                    {key: {c: true}, value: [{a: {c: true}, b: 20}, {a: {c: true}, b: 5}]},
                    {key: {c: false}, value: [{a: {c: false}, b: 20}]}
                ]);
            });
            it("key is object with comparer and value selector", () => {
                const actual = chain.groupComparedBy([
                    {a: {c: true}, b: 20},
                    {a: {c: true}, b: 5},
                    {a: {c: false}, b: 20}
                ], x => x.a, (a, b) => a.c === b.c, x => x.b).array;
                expect(actual).toEqual([
                    {key: {c: true}, value: [20, 5]},
                    {key: {c: false}, value: [20]}
                ]);
            });
        });
    });

    describe("functions", () => {
        describe("every", () => {
            it("without condition", () => {
                const truthyActual = chain.every([1, 2, 3, 4, 5]);
                const falsyActual = chain.every([undefined, false, "", 0, null, 1]);
                expect(truthyActual).toBeTruthy();
                expect(falsyActual).toBeFalsy();
            });
            it("with condition", () => {
                const actual = chain.every([1, 2, 3, 4], x => x === 3);
                expect(actual).toBeFalsy();
            });
        });
        describe("count", () => {
            it("without condition", () => {
                const actual = chain.count([1, 2, 3, 4, 5, 6]);
                expect(actual).toBe(6);
            });
            it("with condition", () => {
                const actual = chain.count([1, 2, 3, 4, 5, 6], x => x % 2 === 0);
                expect(actual).toBe(3);
            });
        });
        describe("contains", () => {
            const obj = {a: 10, b: 20};
            const iterable = [obj, {...obj}, {a: 15, b: 30}];
            it("without comparer", () => {
                expect(chain.contains(iterable, obj)).toBe(true);
                expect(chain.contains(iterable, {a: 10, b: 20})).toBe(false);
            });
            it("with comparer", () => {
                const actual = chain.contains(iterable, {a: 10, b: 20}, (a, b) => a.a === b.a && a.b === b.b);
                expect(actual).toBe(true);
            });
        });
        describe("first", () => {
            it("empty collection", () => {
                expect(() => {
                    chain.first([]);
                }).toThrow();
            });
            it("without condition", () => {
                const actual = chain.first([1, 2, 3]);
                expect(actual).toBe(1);
            });
            it("with condition, but not found", () => {
                expect(() => {
                    chain.first([1, 2, 3], x => x === 4);
                }).toThrow();
            });
            it("with condition", () => {
                const actual = chain.first([1, 2, 3], x => x === 2);
                expect(actual).toBe(2);
            });
        });
        describe("firstOrDefault", () => {
            it("empty collection", () => {
                const actual = chain.firstOrDefault([], -1);
                expect(actual).toBe(-1);
            });
            it("without condition", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1);
                expect(actual).toBe(1);
            });
            it("with condition - not found", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1, x => x === 4);
                expect(actual).toBe(-1);
            });
            it("with condition", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1, x => x === 2);
                expect(actual).toBe(2);
            });
        });
        describe("single", () => {
            it("empty collection", () => {
                expect(() => {
                    chain.single([]);
                }).toThrow();
            });
            it("one element in collection", () => {
                const actual = chain.single([1]);
                expect(actual).toBe(1);
            });
            it("two elements in collection", () => {
                expect(() => {
                    chain.single([1, 2]);
                }).toThrow();
            });
            it("with condition - not found", () => {
                expect(() => {
                    chain.single([1, 2, 3], x => x === 4);
                }).toThrow();
            });
            it("with condition - more then one", () => {
                expect(() => {
                    chain.single([1, 2, 3], x => x % 2 === 1);
                }).toThrow();
            });
            it("with condition", () => {
                const actual = chain.single([1, 2, 3], x => x === 2);
                expect(actual).toBe(2);
            });
        });
        describe("singleOrDefault", () => {
            it("empty collection", () => {
                const actual = chain.singleOrDefault([], "default");
                expect(actual).toBe("default");
            });
            it("one element in collection", () => {
                const actual = chain.singleOrDefault([1], -1);
                expect(actual).toBe(1);
            });
            it("two elements in collection", () => {
                expect(() => {
                    chain.singleOrDefault([1, 2], -1);
                }).toThrow();
            });
            it("with condition - not found", () => {
                const actual = chain.singleOrDefault([1, 2, 3], -1, x => x === 4);
                expect(actual).toBe(-1);
            });
            it("with condition - more then one", () => {
                expect(() => {
                    chain.singleOrDefault([1, 2, 3], -1, x => x % 2 === 1);
                }).toThrow();
            });
            it("with condition", () => {
                const actual = chain.singleOrDefault([1, 2, 3], -1, x => x === 2);
                expect(actual).toBe(2);
            });
        });
        describe("last", () => {
            it("empty collection", () => {
                expect(() => {
                    chain.last([]);
                }).toThrow();
            });
            it("without condition", () => {
                const actual = chain.last([1, 2, 3]);
                expect(actual).toBe(3);
            });
            it("with condition - not found", () => {
                expect(() => {
                    chain.last([1, 2, 3], x => x === 4);
                }).toThrow();
            });
            it("with condition", () => {
                const actual = chain.last([1, 2, 3], x => x % 2 === 1);
                expect(actual).toBe(3);
            });
        });
        describe("lastOrDefault", () => {
            it("empty collection", () => {
                const actual = chain.lastOrDefault([], "default");
                expect(actual).toBe("default");
            });
            it("without condition", () => {
                const actual = chain.lastOrDefault([1, 2, 3], -1);
                expect(actual).toBe(3);
            });
            it("with condition - not found", () => {
                const actual = chain.lastOrDefault([1, 2, 3], -1, x => x === 4);
                expect(actual).toBe(-1);
            });
            it("with condition", () => {
                const actual = chain.lastOrDefault([1, 2, 3], -1, x => x % 2 === 1);
                expect(actual).toBe(3);
            });
        });
    });
});
