import { chain } from "../../src";

describe("take", () => {
    it("static - empty collection", () => {
        const actual = chain.take([], 50).toArray();
        expect(actual).toEqual([]);
    });
    it("static - zero count", () => {
        const actual = chain.take([1, 2, 3], 0).toArray();
        expect(actual).toEqual([]);
    });
    it("static", () => {
        const actual = chain.take([1, 2, 3, 4], 3).toArray();
        expect(actual).toEqual([1, 2, 3]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).take(2).toArray();
        expect(actual).toEqual([1, 2]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).take(1).toArray();
        expect(acutal).toEqual([["a", 1]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).take(2).toArray();
        expect(acutal).toEqual([1, 2]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).take(1).toArray();
        expect(actual).toEqual([{ key: "a", value: 10 }]);
    });
});