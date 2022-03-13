import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("take")
    .case("simple", simpleArray, simpleArray.slice(0, 2), 2)
    .case("empty", [], [], 50)
    .case("zero count", simpleArray, [], 0)
    .case("map", simpleMap, [["a", 1]], 1)
    .case("set", simpleSet, [1, 2], 2)
    .object("object", simpleObject, [["a", 1]], 1);
