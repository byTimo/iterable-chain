import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("some")
    .case("empty", [], false)
    .case("array of falsies", [false, undefined, null, 0], false)
    .case("array of falsies with one truthy", [false, undefined, 1], true)
    .case("array", simpleArray, true)
    .case("array with condition", simpleArray, false, x => x > 4)
    .case("array with condition with index", simpleArray, true, (x, i) => x > 4 || i === 2)
    .case("map", simpleMap, true)
    .case("set", simpleSet, true)
    .object("object", simpleObject, true);
