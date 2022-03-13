import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("map")
    .case("simple", simpleArray, [2, 3, 4], x => x + 1)
    .case("to other type", simpleArray, [false, true, false], x => x % 2 === 0)
    .case("map", simpleMap, [1, 2], ([, value]) => value)
    .case("set", simpleSet, simpleArray, x => x)
    .object("object", simpleObject, ["a", "b", "c"], ([key]) => key);
