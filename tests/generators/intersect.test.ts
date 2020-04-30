import { chain } from "../../src";

describe("intersect", () => {
    it("static - primitive", () => {
        const actual = chain.intersect([1, 2, 3], [2, 3, 4]).toArray();
        expect(actual).toEqual([2, 3]);
    });
    it("static - objects without stringifier", () => {
        const actual = chain.intersect([{ a: 10 }, { a: 15 }], [{ a: 15 }]).toArray();
        expect(actual).toEqual([]);
    });
    it("static - objects with stringifer", () => {
        const actual = chain.intersect([{ a: 10 }, { a: 15 }], [{ a: 15 }], x => x.a.toString()).toArray();
        expect(actual).toEqual([{ a: 15 }]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).intersect([2]).toArray();
        expect(actual).toEqual([2]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).intersect([["a", 1]], ([key]) => key).toArray();
        expect(acutal).toEqual([["a", 1]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).intersect([1, 2]).toArray();
        expect(acutal).toEqual([1, 2]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).intersect([{ key: "a", value: 10 }], ({ key }) => key).toArray();
        expect(actual).toEqual([{ key: "a", value: 10 }]);
    });
});