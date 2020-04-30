import { chain } from "../../src";

describe("groupComparedBy", () => {
    it("static - primitive", () => {
        const actual = chain.groupComparedBy([1, 2, 3, 4, 5], x => x % 2).toArray();
        expect(actual).toEqual([{ key: 1, value: [1, 3, 5] }, { key: 0, value: [2, 4] }]);
    });
    it("static - objects without comparer", () => {
        const actual = chain.groupComparedBy([
            { a: { c: true }, b: 20 },
            { a: { c: true }, b: 5 },
            { a: { c: false }, b: 20 }
        ], x => x.a).toArray();
        expect(actual).toEqual([
            { key: { c: true }, value: [{ a: { c: true }, b: 20 }] },
            { key: { c: true }, value: [{ a: { c: true }, b: 5 }] },
            { key: { c: false }, value: [{ a: { c: false }, b: 20 }] }
        ]);
    });
    it("static - objects with comparer", () => {
        const actual = chain.groupComparedBy([
            { a: { c: true }, b: 20 },
            { a: { c: true }, b: 5 },
            { a: { c: false }, b: 20 }
        ], x => x.a, (a, b) => a.c === b.c).toArray();
        expect(actual).toEqual([
            { key: { c: true }, value: [{ a: { c: true }, b: 20 }, { a: { c: true }, b: 5 }] },
            { key: { c: false }, value: [{ a: { c: false }, b: 20 }] }
        ]);
    });
    it("static - objects with comparer and value selector", () => {
        const actual = chain.groupComparedBy([
            { a: { c: true }, b: 20 },
            { a: { c: true }, b: 5 },
            { a: { c: false }, b: 20 }
        ], x => x.a, (a, b) => a.c === b.c, x => x.b).toArray();
        expect(actual).toEqual([
            { key: { c: true }, value: [20, 5] },
            { key: { c: false }, value: [20] }
        ]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).groupComparedBy(x => x % 2).toArray();
        expect(actual).toEqual([{ key: 1, value: [1, 3] }, { key: 0, value: [2] }]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]]))
            .groupComparedBy(x => x, (a, b) => a[1] === b[1], ([key]) => key)
            .toObject(x => `${x.key[0]}${x.key[1]}`, x => x.value[0]);
        expect(acutal).toEqual({ "a1": "a", "b2": "b" });
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).groupComparedBy(x => x % 2).toArray();
        expect(acutal).toEqual([{ key: 1, value: [1, 3] }, { key: 0, value: [2] }]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 })
            .groupComparedBy(({ key, value }) => `${key}${value}`, undefined, ({ value }) => value)
            .toArray();
        expect(actual).toEqual([{ key: "a10", value: [10] }, { key: "b20", value: [20] }]);
    });
});