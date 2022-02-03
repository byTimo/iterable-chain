import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("skip")
    .case("simple", simpleArray, simpleArray.slice(2), 2)
    .case("empty", [], [], 50)
    .case("zero count", simpleArray, simpleArray, 0)
    .case("map", simpleMap, [["b", 2]], 1)
    .case("set", simpleSet, [3], 2)
    .object("object", simpleObject, [["b", 2], ["c", 3]], 1);
