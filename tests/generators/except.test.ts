import { chain } from "../../src";

describe("except", () => {
    it("static - primitive", () => {
        const actual = chain.except([1, 2, 3], [2, 3, 4]).toArray();
        expect(actual).toEqual([1]);
    });
    it("static - objects without stringifier", () => {
        const actual = chain.except([{ a: 10 }, { a: 15 }], [{ a: 15 }]).toArray();
        expect(actual).toEqual([{ a: 10 }, { a: 15 }]);
    });
    it("static - objects with stringifer", () => {
        const actual = chain.except([{ a: 10 }, { a: 15 }], [{ a: 15 }], x => x.a.toString()).toArray();
        expect(actual).toEqual([{ a: 10 }]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).except([2]).toArray();
        expect(actual).toEqual([1, 3]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).except([["a", 1]], ([key]) => key).toArray();
        expect(acutal).toEqual([["b", 2]]);
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).except([1, 2]).toArray();
        expect(acutal).toEqual([3]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 }).except([{ key: "a", value: 10 }], ({ key }) => key).toArray();
        expect(actual).toEqual([{ key: "b", value: 20 }]);
    });
});