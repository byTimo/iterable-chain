import { chain } from "../src"

describe("create", () => {
    it("array", () => {
        const actual = chain([1, 2, 3]).toArray();
        expect(actual).toEqual([1, 2, 3]);
    });
    it("map", () => {
        const actual = chain(new Map([["a", 10], ["b", 15]])).toArray();
        expect(actual).toEqual([["a", 10], ["b", 15]]);
    });
    it("set", () => {
        const actual = chain(new Set([1, 2, 3, 4])).toArray();
        expect(actual).toEqual([1, 2, 3, 4]);
    });
    it("object", () => {
        const actual = chain({ a: 1, b: 2 }).toArray();
        expect(actual).toEqual([{ key: "a", value: 1 }, { key: "b", value: 2 }]);
    });
})