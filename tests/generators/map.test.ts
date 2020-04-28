import { chain } from "../../src";

describe("map", () => {
    it("static", () => {
        const actual = chain.map([1, 2, 3, 4], x => x + 50).toArray();
        expect(actual).toEqual([51, 52, 53, 54]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).map(x => x + 50).toArray();
        expect(actual).toEqual([51, 52, 53]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).map(([key, value]) => `${key}${value}`).toArray();
        expect(acutal).toEqual(["a1", "b2"]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).map(x => x + 50).toArray();
        expect(acutal).toEqual([51, 52, 53]);
    });
    it("object", () => {
        const actual = chain({a: 10, b: 20}).map(({key, value}) => `${key}${value}`).toArray();
        expect(actual).toEqual(["a10", "b20"]);
    })
})