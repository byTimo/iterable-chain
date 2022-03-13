import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("count")
    .case("empty", [], 0)
    .case("array of falsies", [false, undefined, null, 0], 4)
    .case("array", simpleArray, 3)
    .case("array with condition", simpleArray, 1, x => x > 2)
    .case("array with condition with index", simpleArray, 2, (x, i) => x > 2 || i > 0)
    .case("map", simpleMap, 2)
    .case("set", simpleSet, 3)
    .object("object", simpleObject, 3);
