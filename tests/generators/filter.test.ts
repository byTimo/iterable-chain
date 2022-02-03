import { chain } from "../../src";
import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("filter")
    .case("simple", simpleArray, [2], x => x % 2 === 0)
    .case("map", simpleMap, [["b", 2],], ([, value]) => value % 2 === 0)
    .case("set", simpleSet, [2], x => x % 2 === 0)
    .object("object", simpleObject, [["a", 1]], ([key]) => key === "a");

function isNumber(a: number | string): a is number {
    return typeof a === "number";
}

describe("filter", () => {
    it("static: type guard", () => {
        const actual = chain.filter([1, "2", 3, "4"], isNumber).toArray();
        const first: number = actual[0]; //type check
        expect(actual).toEqual([1, 3]);
    });
    it("chain: type guard", () => {
        const actual = chain([1, "2", 3]).filter(isNumber).toArray();
        const first: number = actual[0]; //type check
        expect(actual).toEqual([1, 3]);
    });
});
