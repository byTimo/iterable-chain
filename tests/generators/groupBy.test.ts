import { buildTest, simpleArray, complexArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("groupBy")
    .case("simple", simpleArray, [[1, [1, 3]], [0, [2]]], x => x % 2)
    .case("objects without value selector", complexArray, [["a", complexArray]], () => "a")
    .case("objects with value selector", complexArray, [["a", [10, 20, 30]]], () => "a", x => x.a)
    .case("objects with stringifier", complexArray, [[{a: 10}, [10, 20, 30]]], x => x, x =>x.a, () => "a")
    .case("map", simpleMap, [[1, ["a"]], [2, ["b"]]], ([, value]) => value, ([key]) => key)
    .case("set", simpleSet, [[1, [1, 3]], [0, [2]]], x => x % 2)
    .object("object", simpleObject, [[1, ["a", "c"]], [0, ["b"]]], ([, value]) => value % 2, ([key]) => key);
