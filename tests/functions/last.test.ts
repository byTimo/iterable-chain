import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";
import { chain } from "../../src";

buildTest("last")
    .case("array with condition", simpleArray, 2, x => x < 3)
    .case("array with condition with index", simpleArray, 3, (x, i) => x < 4 && i > 1)
    .case("map", simpleMap, ["b", 2], )
    .case("set", simpleSet, 3, )
    .object("object", simpleObject, ["c", 3]);

describe("last", () => {
    it("static: empty", () => {
        expect(() => {
            chain.last([]);
        }).toThrow();
    });

    it("chain: empty", () => {
        expect(() => {
            chain([]).last();
        }).toThrow();
    });
});
