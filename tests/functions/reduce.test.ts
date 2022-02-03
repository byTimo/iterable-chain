import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";
import { chain } from "../../src";

const keysReducer = ([accKey, accValue]: any, [key, value]: any) => [accKey + key, accValue + value];

buildTest("reduce")
    .case("array", simpleArray, 6, (a: any, c) => a + c)
    .case("array with initial", simpleArray, 106, (a: any, c) => a + c, 100)
    .case("array with other type initial", simpleArray, "123", (a: any, c) => a + c, "")
    .case("map", simpleMap, ["ab", 3], keysReducer)
    .case("set", simpleSet, 6, (a: any, c) => a + c)
    .object("object", simpleObject, ["abc", 6], keysReducer)

describe("reduce", () => {
    it("static: empty", () => {
        expect(chain(simpleArray).reduce((a, c) => a + c)).toBe(6);
        expect(() => {
            chain.reduce([], x => x);
        }).toThrow();
    });

    it("chain: empty", () => {
        expect(() => {
            chain([]).reduce(x => x);
        }).toThrow();
    });
});
