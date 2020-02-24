import { ChainIterable } from "../src/chainIterable";
import { chain } from "../src";

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

describe("chain iterable", () => {
    describe("convert", () => {
        it("to array", () => {
            const actual = new ChainIterable([1, 2, 3, 4]).array;
            expect(actual).toEqual([1, 2, 3, 4]);
        });
        it("to object without value selector", () => {
            const actaul = new ChainIterable([{ a: 1 }, { a: 2 }, { a: 3 }]).object(x => x.a);
            expect(actaul).toEqual({ 1: { a: 1 }, 2: { a: 2 }, 3: { a: 3 } });
        });
        it("to object with value selector", () => {
            const actaul = new ChainIterable([{ a: 1 }, { a: 2 }, { a: 3 }]).object(x => x.a, x => x.a);
            expect(actaul).toEqual({ 1: 1, 2: 2, 3: 3 });
        });
        it("to object with duplicate key - throw error", () => {
            expect(() => {
                new ChainIterable([1, 2, 3, 4]).object(x => x % 2)
            }).toThrow();
        })
    })
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