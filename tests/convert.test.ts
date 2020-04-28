import { chain } from "../src";

describe("convert", () => {
    describe("array", () => {
        it("to array", () => {
            const actual = chain([1, 2, 3, 4]).toArray();
            expect(actual).toEqual([1, 2, 3, 4]);
        });
        it("to object without value selector", () => {
            const actual = chain([{ a: 1 }, { a: 2 }, { a: 3 }]).toObject(x => x.a);
            expect(actual).toEqual({ 1: { a: 1 }, 2: { a: 2 }, 3: { a: 3 } });
        });
        it("to object with value selector", () => {
            const actual = chain([{ a: 1 }, { a: 2 }, { a: 3 }]).toObject(x => x.a, x => x.a);
            expect(actual).toEqual({ 1: 1, 2: 2, 3: 3 });
        });
        it("to object with duplicate key - throw error", () => {
            expect(() => {
                chain([1, 2, 3, 4]).toObject(x => x % 2);
            }).toThrow();
        });
        it("to Set", () => {
            const actual = chain([1, 2, 2, 4, 5]).toSet();
            expect(actual).toEqual(new Set([1, 2, 4, 5]));
        });
        it("to Map without value selector", () => {
            const actual = chain([{ a: 1 }, { a: 2 }, { a: 3 }]).toMap(x => x.a);
            expect(actual).toEqual(new Map([[1, { a: 1 }], [2, { a: 2 }], [3, { a: 3 }]]));
        });
        it("to Map with value selector", () => {
            const actual = chain([{ a: 1 }, { a: 2 }, { a: 3 }]).toMap(x => x.a, x => x.a);
            expect(actual).toEqual(new Map([[1, 1], [2, 2], [3, 3]]));
        });
        it("to Map with duplicate key - throw error", () => {
            expect(() => {
                chain([1, 2, 3, 4]).toMap(x => x % 2);
            }).toThrow();
        });
    });
    describe("object", () => {
        it("to array", () => {
            const actual = chain({ a: 10, b: 20 }).toArray();
            expect(actual).toEqual([{ key: "a", value: 10 }, { key: "b", value: 20 }]);
        });
        it("to object without value selector", () => {
            const actual = chain({ a: 10, b: 20 }).toObject(x => x.key);
            expect(actual).toEqual({ a: { key: "a", value: 10 }, b: { key: "b", value: 20 } });
        });
        it("to object with value selector", () => {
            const actual = chain({ a: 10, b: 20 }).toObject(x => x.key, x => x.value);
            expect(actual).toEqual({ a: 10, b: 20 });
        });
        it("to Map", () => {
            const actual = chain({ a: 10, b: 20 }).toMap(x => x.key, x => x.value);
            expect(actual).toEqual(new Map([["a", 10], ["b", 20]]));
        });
        it("to Set", () => {
            const actual = chain({a: 10, b: 20}).toSet()
            expect(actual).toEqual(new Set([{ key: "a", value: 10 }, { key: "b", value: 20 }]));
        })
    })
});