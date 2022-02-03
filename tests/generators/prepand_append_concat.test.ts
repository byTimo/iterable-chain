import { buildTest, simpleArray, simpleMap, simpleSet, simpleObject } from "../common";

buildTest("append")
    .case("simple", simpleArray, [...simpleArray, 4], 4)
    .case("map", simpleMap, [["a", 1], ["b", 2], ["c", 3]], ["c", 3])
    .case("set", simpleSet, [...simpleArray, 4], 4)
    .object("object", simpleObject, [["a", 1], ["b", 2], ["c", 3], ["d", 4]], ["d", 4]);

buildTest("prepend")
    .case("simple", simpleArray, [4, ...simpleArray], 4)
    .case("map", simpleMap, [["c", 3], ["a", 1], ["b", 2]], ["c", 3])
    .case("set", simpleSet, [4, ...simpleArray], 4)
    .object("object", simpleObject, [["d", 4], ["a", 1], ["b", 2], ["c", 3]], ["d", 4]);

buildTest("concat")
    .case("simple", simpleArray, [...simpleArray, ...simpleArray], simpleArray)
    .case("several types", simpleArray, [...simpleArray, "b", true, { a: 25 }], ["b", true, { a: 25 }])
    .case("map", simpleMap, [["a", 1], ["b", 2], ["c", 3]], [["c", 3]])
    .case("set", simpleSet, [...simpleArray, ...simpleArray], simpleArray)
    .object("object", simpleObject, [["a", 1], ["b", 2], ["c", 3], ["d", 4]], [["d", 4]]);
