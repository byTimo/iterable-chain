import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";
import { chain } from "../../src";

buildTest("singleOrDefault")
    .case('empty', [], 100, 100)
    .case("array with condition for empty", simpleArray, 100, 100, x => x > 100)
    .case("array with condition for single", simpleArray, 3, 100, x => x > 2)
    .case("array with condition for single with index", simpleArray, 2, 100, (x, i) => x < 3 && i > 0)
    .case("map", simpleMap, ["a", 1], ["q", 100], ([key]) => key === "a")
    .case("set", simpleSet, 1, 100, x => x < 2)
    .object("object", simpleObject, ["a", 1], ["q", 100], ([, value]) => value < 2);

describe("singleOrDefault", () => {
    it("static: array more then 1 without condition", () => {
        expect(() => {
            chain.single([1, 2]);
        }).toThrow();
    });

    it("chain: array more then 1 without condition", () => {
        expect(() => {
            chain([1, 2]).single();
        }).toThrow();
    });
});
