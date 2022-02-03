import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("lastOrDefault")
    .case("empty", [], 100, 100)
    .case("array of falsies", [false, undefined, null, 0], 0, 100)
    .case("array", simpleArray, 3, 100)
    .case("array with condition", simpleArray, 100, 100, x => x > 4)
    .case("array with condition with index", simpleArray, 3, 100, (x, i) => x > 4 || i === 2)
    .case("map", simpleMap, ["b", 2], ["q", 100])
    .case("set", simpleSet, 3, 100)
    .object("object", simpleObject, ["c", 3], ["q", 100]);
