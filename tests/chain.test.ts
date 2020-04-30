import { chain } from "../src";

//TODO (byTimo) Set, Map, Record
describe("chain global", () => {
    describe("functions", () => {
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
        });
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
            const obj = { a: 10, b: 20 };
            const iterable = [obj, { ...obj }, { a: 15, b: 30 }];
            it("without comparer", () => {
                expect(chain.contains(iterable, obj)).toBe(true);
                expect(chain.contains(iterable, { a: 10, b: 20 })).toBe(false);
            });
            it("with comparer", () => {
                const actual = chain.contains(iterable, { a: 10, b: 20 }, (a, b) => a.a === b.a && a.b === b.b);
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
        describe("reduce", () => {
            describe("without initial value", () => {
                it("empty collection", () => {
                    expect(() => {
                        chain.reduce([], p => p);
                    }).toThrow();
                });
                it("collection with one element", () => {
                    const actual = chain.reduce([1], (p, c, i) => p + c + i + 1);
                    expect(actual).toBe(1);
                });
                it("collection with several elements", () => {
                    const actual = chain.reduce(["1", "2", "3"], (p, c) => p + c);
                    expect(actual).toBe("123");
                });
            });
            describe("with initial value", () => {
                it("empty collcetion", () => {
                    const actual = chain.reduce([], p => p, 0);
                    expect(actual).toBe(0);
                });
                it("collection with one element", () => {
                    const actual = chain.reduce([1], (p, c, i) => p + c + i + 1, 15);
                    expect(actual).toBe(17);
                });
                it("collection with several elements", () => {
                    const actual = chain.reduce(["1", "2", "3"], (p, c) => p + parseInt(c), 100);
                    expect(actual).toBe(106);
                });
            });
        });
        describe("min", () => {
            it("empty collection", () => {
                const actual = chain.min([]);
                expect(actual).toBe(Number.POSITIVE_INFINITY);
            });
            it("collection with items", () => {
                const actual = chain.min([-1, 0, 15, -9]);
                expect(actual).toBe(-9);
            });
        });
        describe("max", () => {
            it("empty collection", () => {
                const actual = chain.max([]);
                expect(actual).toBe(Number.NEGATIVE_INFINITY);
            });
            it("collection with items", () => {
                const actual = chain.max([-1, 0, 15, -9]);
                expect(actual).toBe(15);
            });
        });
        describe("sum", () => {
            it("empty collection", () => {
                const actual = chain.sum([]);
                expect(actual).toBe(0);
            });
            it("collection with items", () => {
                const actual = chain.sum([-1, 0, 15, -9]);
                expect(actual).toBe(5);
            });
        });
    });
});
