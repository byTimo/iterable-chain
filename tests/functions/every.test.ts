import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("every")
    .case("empty", [], true, Boolean)
    .case("array of falsies", [false, undefined, null, 0], false, Boolean)
    .case("array of falsies with one truthy", [false, undefined, 1], false, Boolean)
    .case("array", simpleArray, true, Boolean)
    .case("array with condition", simpleArray, false, x => x > 2)
    .case("array with condition with index", simpleArray, true, (x, i) => x > 4 || i < 5)
    .case("map", simpleMap, true, Boolean)
    .case("set", simpleSet, true, Boolean)
    .object("object", simpleObject, true, Boolean);
