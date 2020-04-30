import { chain } from "../../src";

describe("distinct", () => {
    it("static - primitive", () => {
        const actual = chain.distinct([1, 1, 2, 3, 4, 4, 10]).toArray();
        expect(actual).toEqual([1, 2, 3, 4, 10]);
    });
    it("static - object without stringifier", () => {
        const actual = chain.distinct([{ a: 10 }, { a: 10 }]).toArray();
        expect(actual).toEqual([{ a: 10 }, { a: 10 }]);
    });
    it("static - object with stringifier", () => {
        const actual = chain.distinct([{ a: 10 }, { a: 10 }], x => x.a.toString()).toArray();
        expect(actual).toEqual([{ a: 10 }]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3, 3, 2, 1]).distinct().toArray();
        expect(actual).toEqual([1, 2, 3]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 2], ["b", 2]])).distinct(([_, value]) => value.toString()).toArray();
        expect(acutal).toEqual([["a", 2]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([{ a: 10 }, { a: 20 }])).distinct(x => Object.keys(x)[0]).toArray();
        expect(acutal).toEqual([{ a: 10 }]);
    });
    it("object", () => {
        const actual = chain({ a: 20, b: 20 }).distinct(({ value }) => value.toString()).toArray();
        expect(actual).toEqual([{ key: "a", value: 20 }]);
    });
});