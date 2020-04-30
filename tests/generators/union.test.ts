import { chain } from "../../src";

describe("union", () => {
    it("static - primitives", () => {
        const actual = chain.union([1, 2, 3], [2, 3, 4]).toArray();
        expect(actual).toEqual([1, 2, 3, 4]);
    });
    it("static - objects without stringifier", () => {
        const actual = chain.union([{ a: 10 }, { a: 15 }], [{ a: 15 }]).toArray();
        expect(actual).toEqual([{ a: 10 }, { a: 15 }, { a: 15 }]);
    });
    it("statis - objects with stringifier", () => {
        const actual = chain.union([{ a: 10 }, { a: 15 }], [{ a: 15 }], x => x.a.toString()).toArray();
        expect(actual).toEqual([{ a: 10 }, { a: 15 }]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).union([2, 3, 4]).toArray();
        expect(actual).toEqual([1, 2, 3, 4]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).union([["a", 1], ["c", 3]], ([key]) => key).toArray();
        expect(acutal).toEqual([["a", 1], ["b", 2], ["c", 3]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).union([2, 4]).toArray();
        expect(acutal).toEqual([1, 2, 3, 4]);
    });
    it("object", () => {
        const actual = chain<string, number>({ a: 10, b: 20 }).union([{ key: "a", value: 10 }, { key: "c", value: 30 }], ({ key }) => key).toArray();
        expect(actual).toEqual([{ key: "a", value: 10 }, { key: "b", value: 20 }, { key: "c", value: 30 }]);
    });
});