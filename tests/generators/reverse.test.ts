import { chain } from "../../src";

describe("reverse", () => {
    it("static", () => {
        const actual = chain.reverse([1, 2, 3, 4]).toArray();
        expect(actual).toEqual([4, 3, 2, 1]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).reverse().toArray();
        expect(actual).toEqual([3, 2, 1]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).reverse().toArray();
        expect(acutal).toEqual([["b", 2], ["a", 1]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).reverse().toArray();
        expect(acutal).toEqual([3, 2, 1]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).reverse().toArray();
        expect(actual).toEqual([{ key: "b", value: 20 }, { key: "a", value: 10 }]);
    });
});