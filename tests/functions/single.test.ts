import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";
import { chain } from "../../src";

buildTest("single")
    .case("array with condition", simpleArray, 3, x => x > 2)
    .case("array with condition with index", simpleArray, 2, (x, i) => x < 3 && i > 0)
    .case("map", simpleMap, ["a", 1], ([key]) => key === "a")
    .case("set", simpleSet, 1, x => x < 2)
    .object("object", simpleObject, ["a", 1], ([, value]) => value < 2);

describe("single", () => {
    it("static: empty", () => {
        expect(() => {
            chain.single([]);
        }).toThrow();
    });

    it("chain: empty", () => {
        expect(() => {
            chain([]).single();
        }).toThrow();
    });

    it("static: array with condition for empty", () => {
        expect(() => {
            chain.single(simpleArray, x => x > 100);
        }).toThrow();
    });

    it("chain: array with condition for empty", () => {
        expect(() => {
            chain(simpleArray).single(x => x > 100);
        }).toThrow();
    });

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
