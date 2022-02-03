import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";
import { chain } from "../../src";

buildTest("first")
    .case("array of falsies", [false, undefined, null, 0], false)
    .case("array", simpleArray, 1)
    .case("array with condition", simpleArray, 3, x => x > 2)
    .case("array with condition with index", simpleArray, 2, (x, i) => x > 4 || i > 0)
    .case("map", simpleMap, ["a", 1])
    .case("set", simpleSet, 1)
    .object("object", simpleObject, ["a", 1]);

describe("first", () => {
    it("static: empty", () => {
        expect(() => {
            chain.first([]);
        }).toThrow();
    });

    it("chain: empty", () => {
        expect(() => {
            chain([]).first();
        }).toThrow();
    });
});
