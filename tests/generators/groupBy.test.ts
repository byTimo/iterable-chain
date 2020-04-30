import { chain } from "../../src";

describe("groupBy", () => {
    it("static - primitives", () => {
        const actual = chain.groupBy([1, 2, 3, 4, 5], x => x % 2).toArray();
        expect(actual).toEqual([{ key: "0", value: [2, 4] }, { key: "1", value: [1, 3, 5] }]);
    });
    it("static - object without value selector", () => {
        const actual = chain.groupBy([{ a: 10, b: 20 }, { a: 10, b: 30 }], x => x.a).toArray();
        expect(actual).toEqual([{ key: "10", value: [{ a: 10, b: 20 }, { a: 10, b: 30 }] }]);
    });
    it("static - object with value selectir", () => {
        const actual = chain.groupBy([{ a: 10, b: 20 }, { a: 10, b: 30 }], x => x.a, x => x.b).toArray();
        expect(actual).toEqual([{ key: "10", value: [20, 30] }]);
    });
    it("array", () => {
        const actual = chain([1, 2, 3]).groupBy(x => x % 2).toArray();
        expect(actual).toEqual([{ key: "0", value: [2] }, { key: "1", value: [1, 3] }]);
    });
    it("Map", () => {
        const acutal = chain(new Map([["a", 1], ["b", 2]])).groupBy(([_, value]) => value, ([key]) => key).toObject(x => x.key, x => x.value[0]);
        expect(acutal).toEqual({ 1: "a", 2: "b" });
    });
    it("Set", () => {
        const acutal = chain(new Set([1, 2, 3])).groupBy(x => x % 2).toArray();
        expect(acutal).toEqual([{ key: "0", value: [2] }, { key: "1", value: [1, 3] }]);
    });
    it("object", () => {
        const actual = chain({ a: 10, b: 20 })
            .groupBy(({ key, value }) => `${key}${value}`, ({ value }) => value)
            .toArray();
        expect(actual).toEqual([{ key: "a10", value: [10] }, { key: "b20", value: [20] }]);
    });
});