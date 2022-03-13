import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("firstOreDefault")
    .case("empty", [], 100, 100)
    .case("array of falsies", [false, undefined, null, 0], false, 100)
    .case("array", simpleArray, 1, 100)
    .case("array with condition", simpleArray, 100, 100, x => x > 4)
    .case("array with condition with index", simpleArray, 3, 100, (x, i) => x > 4 || i === 2)
    .case("map", simpleMap, ["a", 1], ["q", 100])
    .case("set", simpleSet, 1, 100)
    .object("object", simpleObject, ["a", 1], ["q", 100]);
