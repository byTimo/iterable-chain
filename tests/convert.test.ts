import { chain } from "../src";
import { simpleArray, simpleMap, simpleSet, simpleObject } from "./common";

describe("convert", () => {
    describe("toArray", () => {
        it("source is array", () => {
            const actual = chain(simpleArray).toArray();
            expect(actual).toBe(simpleArray);
        });

        it("source is other iterable", () => {
            const actual = chain(simpleArray).map(x => x).toArray();
            expect(actual).not.toBe(simpleArray);
            expect(actual).toEqual(simpleArray);
        });

        it("map", () => {
            const actual = chain(simpleMap).toArray();
            expect(actual).toEqual([["a", 1], ["b", 2]]);
        });

        it("set", () => {
            const actual = chain(simpleSet).toArray();
            expect(actual).toEqual(simpleArray);
        });

        it("object", () => {
            const actual = chain(simpleObject).toArray();
            expect(actual).toEqual([["a", 1], ["b", 2], ["c", 3]]);
        });
    });

    describe("toSet", () => {
        it("source is set", () => {
            const actual = chain(simpleSet).toSet();
            expect(actual).toBe(simpleSet);
        });

        it("source is other iterable", () => {
            const actual = chain(simpleSet).map(x => x).toSet();
            expect(actual).not.toBe(simpleSet);
            expect(actual).toEqual(simpleSet);
        });

        it("map", () => {
            const actual = chain(simpleMap).toSet();
            expect(actual).toEqual(new Set([["a", 1], ["b", 2]]));
        });

        it("object", () => {
            const actual = chain(simpleObject).toSet();
            expect(actual).toEqual(new Set([["a", 1], ["b", 2], ["c", 3]]));
        });
    });

    describe("toMap", () => {
        it("source is map", () => {
            const actual = chain(simpleMap).toMap(([key]) => key);
            expect(actual).toBe(simpleMap);
        });

        it("source is other iterable", () => {
            const actual = chain(simpleMap).map(x => x).toMap(([key]) => key);
            expect(actual).not.toBe(simpleMap);
            expect(actual).toEqual(new Map([["a", ["a", 1]], ["b", ["b", 2]]]));
        });

        it("without value selector", () => {
            const actual = chain(["a", "b"]).zip(simpleArray).toMap(([key]) => key);
            expect(actual).toEqual(new Map([["a", ["a", 1]], ["b", ["b", 2]]]));
        });

        it("with value selector", () => {
            const actual = chain(["a", "b"]).zip(simpleArray).toMap(([key]) => key, ([, value]) => value);
            expect(actual).toEqual(simpleMap);
        });

        it("duplicated keys", () => {
            expect(() => {
                chain(simpleArray).toMap(x => x % 2);
            }).toThrow();
        });

        it("set", () => {
            const actual = chain(simpleSet).toMap(x => x);
            expect(actual).toEqual(new Map([[1, 1], [2, 2], [3, 3]]));
        });

        it("object", () => {
            const actual = chain(simpleObject).take(2).toMap(([key]) => key, ([, value]) => value);
            expect(actual).toEqual(simpleMap);
        });
    });

    describe("toObject", () => {
        it("without value selector", () => {
            const actual = chain(["a", "b", "c"]).zip(simpleArray).toObject(([key]) => key);
            expect(actual).toEqual({ a: ["a", 1], b: ["b", 2], c: ["c", 3] });
        });

        it("with value selector", () => {
            const actual = chain(["a", "b", "c"]).zip(simpleArray).toObject(([key]) => key, ([, value]) => value);
            expect(actual).toEqual(simpleObject);
        });

        it("duplicated keys", () => {
            expect(() => {
                chain(simpleArray).toObject(x => x % 2);
            }).toThrow();
        });

        it("set", () => {
            const actual = chain(simpleSet).toObject(x => x, x => x);
            expect(actual).toEqual({ 1: 1, 2: 2, 3: 3 });
        });

        it("object", () => {
            const actual = chain(simpleObject).toObject(([key]) => key, ([, value]) => value);
            expect(actual).toEqual(simpleObject);
        });
    });
});
