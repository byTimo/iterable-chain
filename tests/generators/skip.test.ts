import { chain } from "../../src";

describe("skip", () => {
    it("static - empty colletion", () => {
        const actual = chain.skip([], 50).toArray();
        expect(actual).toEqual([]);
    });
    it("static - zero count", () => {
        const actual = chain.skip([1, 2, 3], 0).toArray();
        expect(actual).toEqual([1, 2, 3]);
    });
    it("static", () => {
        const actual = chain.skip([1, 2, 3, 4], 3).toArray();
        expect(actual).toEqual([4]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).skip(2).toArray();
        expect(actual).toEqual([3]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).skip(1).toArray();
        expect(acutal).toEqual([["b", 2]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).skip(2).toArray();
        expect(acutal).toEqual([3]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).skip(1).toArray();
        expect(actual).toEqual([{ key: "b", value: 20 }]);
    });
});