import { ChainIterable, create } from "../src/chainIterable";
import { chain } from "../src";

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

describe("chain iterable", () => {
    describe("can use as Iterable", () => {
        it("from constructor", () => {
            const iterable = create([1, 2, 3, 4, 5]);
            const actual = chain.filter(iterable, x => x === 5);
            expect(actual[Symbol.iterator]().next().value).toEqual(5);
        });
        it("from object", () => {
            const obj = { a: 1, b: 2, c: 3 };
            const actual = chain(obj).toArray();
            expect(actual).toEqual([{ key: "a", value: 1 }, { key: "b", value: 2 }, { key: "c", value: 3 }]);
        });
        it("from chain", () => {
            const iterable = chain([1, 2, 3, 4, 5]);
            const actual = chain.filter(iterable, x => x === 5);
            expect(actual[Symbol.iterator]().next().value).toEqual(5);
        });
    });
    describe("map and filter", () => {
        it("only map", () => {
            const actual = chain([1, 2, 3, 4]).map(x => x + 50).toArray();
            expect(actual).toEqual([51, 52, 53, 54]);
        });
        it("only filter", () => {
            const actual = chain(["1", "2"]).map(x => parseInt(x)).toArray();
            expect(actual).toEqual([1, 2]);
        });
        it("map after filter", () => {
            const actual = create([1, 2, 3, 4, 5])
                .filter(x => x % 2 == 0)
                .map(x => x * 2)
                .toArray();
            expect(actual).toEqual([4, 8]);
        });
        it("filter after map", () => {
            const actual = create([1, 2, 3, 4, 5])
                .map(x => x.toString())
                .filter(x => x !== "1")
                .toArray();
            expect(actual).toEqual(["2", "3", "4", "5"]);
        });
        it("map after filter with type guard", () => {
            const actual = chain(["2", 3, "4", "5"])
                .filter(isNumber)
                .map(x => x + 3)
                .toArray();
            expect(actual).toEqual([6]);
        });
    });
    describe("flatMap", () => {
        it("map to collection collections and back", () => {
            const actual = create([1, 2, 3]).map(x => [x]).flatMap(x => x).toArray()
            expect(actual).toEqual([1, 2, 3]);
        })
    })
});
