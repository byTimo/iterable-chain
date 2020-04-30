import { chain } from "../../src";

describe("flatMap", () => {
    it("static - map to array", () => {
        const actual = chain.flatMap([1, 2, 3], x => [x - 1]).toArray();
        expect(actual).toEqual([0, 1, 2]);
    });
    it("static - map to Set", () => {
        const actual = chain.flatMap([1, 2, 3], x => new Set([x - 1])).toArray();
        expect(actual).toEqual([0, 1, 2]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).flatMap(x => [x, x + 1, x + 2]).toArray();
        expect(actual).toEqual([1, 2, 3, 2, 3, 4, 3, 4, 5]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).flatMap(([key, value]) => [key, value]).toArray();
        expect(acutal).toEqual(["a", 1, "b", 2]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).flatMap(x => [x - 1, x, x + 1]).toArray();
        expect(acutal).toEqual([0, 1, 2, 1, 2, 3, 2, 3, 4]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).flatMap(({ key, value }) => [key, value]).toArray();
        expect(actual).toEqual(["a", 10, "b", 20]);
    });
})