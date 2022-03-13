import { chain } from "../src";
import { isIterable, isIterableChain } from "../src/common";

describe("create", () => {
    it("array", () => {
        const actual = chain([1, 2, 3]);
        expect(isIterable(actual)).toBe(true);
        expect(isIterableChain(actual)).toBe(true);
        expect(actual.toArray()).toEqual([1, 2, 3]);
    });
    it("map", () => {
        const actual = chain(new Map([["a", 10], ["b", 15]]));
        expect(isIterable(actual)).toBe(true);
        expect(isIterableChain(actual)).toBe(true);
        expect(actual.toArray()).toEqual([["a", 10], ["b", 15]]);
    });
    it("set", () => {
        const actual = chain(new Set([1, 2, 3, 4]));
        expect(isIterable(actual)).toBe(true);
        expect(isIterableChain(actual)).toBe(true);
        expect(actual.toArray()).toEqual([1, 2, 3, 4]);
    });
    it("object", () => {
        const actual = chain({ a: 1, b: 2 });
        expect(isIterable(actual)).toBe(true);
        expect(isIterableChain(actual)).toBe(true);
        expect(actual.toArray()).toEqual([["a", 1], ["b", 2]]);
    });
});
