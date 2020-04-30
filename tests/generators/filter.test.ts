import { chain } from "../../src";

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

describe("filter", () => {
    it("static", () => {
        const actual = chain.filter([1, 2, 3, 4], x => x % 2 == 0).toArray();
        expect(actual).toEqual([2, 4]);
    });
    it("static - type guard", () => {
        const actual = chain.filter([1, "2", 3, "4"], isNumber).toArray();
        const first: number = actual[0]; //type check
        expect(actual).toEqual([1, 3]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).filter(x => x % 2 == 0).toArray();
        expect(actual).toEqual([2]);
    });
    it("array - type guard", () => {
        const actual = chain([1, "2", 3]).filter(isNumber).toArray();
        const first: number = actual[0]; //type check
        expect(actual).toEqual([1, 3]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).filter(([key, value]) => value > 1).toArray();
        expect(acutal).toEqual([["b", 2]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).filter(x => x % 2 == 0).toArray();
        expect(acutal).toEqual([2]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).filter(({ key, value }) => value > 15).toArray();
        expect(actual).toEqual([{ key: "b", value: 20 }]);
    });
});