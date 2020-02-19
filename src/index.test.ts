import { chain, ChainIterable } from "."

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

describe("chain", () => {
    describe("chain global", () => {
        //TODO (byTimo) Set, Map, Record
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
            })
        });
        describe("repeat", () => {
            it("repeat number", () => {
                const actual = chain.repate(10, 5).array;
                expect(actual).toEqual([10, 10, 10, 10, 10]);
            });
            it("repeat object", () => {
                const obj = { a: 10 };
                const actual = chain.repate(obj, 3).array;
                expect(actual).toEqual([obj, obj, obj]);
                expect(actual[0]).toBe(obj);
                expect(actual[1]).toBe(obj);
                expect(actual[2]).toBe(obj);
            })
        })
        it("map", () => {
            const actual = chain.map([1, 2, 3, 4], x => x + 50).array;
            expect(actual).toEqual([51, 52, 53, 54]);
        });
        describe("filter", () => {
            it("array - condition return boolean", () => {
                const actual = chain.filter([1, 2, 3, 4], x => x % 2 == 0).array
                expect(actual).toEqual([2, 4])
            })
            it("array - type guard", () => {
                const actual = chain.filter([1, "2", 3, "4"], isNumber).array;
                const first: number = actual[0] //type check
                expect(actual).toEqual([1, 3]);
            })
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
            })
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
                const actual = chain.contains(iterable, { a: 10, b: 20 }, (a, b) => a.a === b.a && a.b === b.b)
                expect(actual).toBe(true);
            });
        });
        describe("first", () => {
            it("empty collection", () => {
                expect(() => {
                    chain.first([]);
                }).toThrow();
            })
            it("without condition", () => {
                const actual = chain.first([1, 2, 3]);
                expect(actual).toBe(1);
            })
            it("with condition, but not found", () => {
                expect(() => {
                    chain.first([1, 2, 3], x => x === 4);
                }).toThrow();
            })
            it("with condition", () => {
                const actual = chain.first([1, 2, 3], x => x === 2);
                expect(actual).toBe(2)
            })
        });
        describe("firstOrDefault", () => {
            it("empty collection", () => {
                const actual = chain.firstOrDefault([], -1);
                expect(actual).toBe(-1);
            })
            it("without condition", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1);
                expect(actual).toBe(1);
            })
            it("with condition, but not found", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1, x => x === 4);
                expect(actual).toBe(-1)
            })
            it("with condition", () => {
                const actual = chain.firstOrDefault([1, 2, 3], -1, x => x === 2);
                expect(actual).toBe(2)
            })
        });
    })
    describe("chain iterable", () => {
        describe("can use as Iterable", () => {
            it("from constuctor", () => {
                const iterable = new ChainIterable([1, 2, 3, 4, 5]);
                const actual = chain.filter(iterable, x => x === 5)
                expect(actual[Symbol.iterator]().next().value).toEqual(5);
            });
            it("from chain", () => {
                const iterable = chain([1, 2, 3, 4, 5]);
                const actual = chain.filter(iterable, x => x === 5)
                expect(actual[Symbol.iterator]().next().value).toEqual(5);
            });
        });
        describe("map and filter", () => {
            it("only map", () => {
                const actual = chain([1, 2, 3, 4]).map(x => x + 50).array;
                expect(actual).toEqual([51, 52, 53, 54])
            });
            it("only filter", () => {
                const actual = chain(["1", "2"]).map(x => parseInt(x)).array;
                expect(actual).toEqual([1, 2]);
            });
            it("map after filter", () => {
                const actual = chain([1, 2, 3, 4, 5])
                    .filter(x => x % 2 == 0)
                    .map(x => x * 2)
                    .array;
                expect(actual).toEqual([4, 8]);
            });
            it("filter after map", () => {
                const actual = chain([1, 2, 3, 4, 5])
                    .map(x => x.toString())
                    .filter(x => x !== "1")
                    .array;
                expect(actual).toEqual(["2", "3", "4", "5"]);
            });
            it("map after filter with type guard", () => {
                const actual = chain(["2", 3, "4", "5"])
                    .filter(isNumber)
                    .map(x => x + 3)
                    .array;
                expect(actual).toEqual([6])
            });
        })
    })
})