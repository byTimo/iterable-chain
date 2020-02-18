import { chain } from "."

function typeGuard(a: number | string): a is number {
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
                const actual = chain.filter([1, "2", 3, "4"], typeGuard).array;
                const first: number = actual[0] //type check
                expect(actual).toEqual([1, 3]);
            })
        })
    })
    describe("chain", () => {
        it("1", () => {
            const actual = chain([1, 2, 3, 4]).map(x => x + 50).array;
            expect(actual).toEqual([51, 52, 53, 54])
        });
        it("2", () => {
            const actual = chain(["1", "2"]).map(x => parseInt(x)).array;
            expect(actual).toEqual([1, 2]);
        })
    })
})